/**
 * Évaluateur du sous-langage Lua utilisé par `DynamicLuaLongDefinitionDTO`.
 *
 * Le game design brut n'exprime ses formules dynamiques (coûts de construction
 * et d'upgrade, bonheur, durées, effets et progression du Heritage Vault) que
 * sous forme de scripts Lua. Le sous-langage réellement employé est minuscule —
 * mesuré sur les 164 scripts du game design : 144 caractères au maximum,
 * quatre variables, trois fonctions (`math.floor`, `math.ceil`, `math.max`),
 * l'arithmétique de base, et au plus un bloc de branchement.
 *
 * Ce module en est un évaluateur dédié — surtout PAS un interpréteur Lua : ni
 * affectation, ni boucle, ni table, ni appel de fonction utilisateur. Tout ce
 * qui sort du sous-langage lève une `LuaFormulaError` explicite plutôt que de
 * produire un nombre faux.
 *
 * Le module couvre un SECOND format, qui partage la même arithmétique : les
 * `dynamicFormulaChangeCase.formula` des tables de paliers (bâtiments
 * `evolving`). Ce sont des expressions nues, sans `return` ni condition ni
 * fonction, dont l'unique variable est préfixée d'un `#` (`"(#level + 18) * 5"`).
 * Sous-ensemble strict de la grammaire Lua ci-dessous, d'où le tokenizer et le
 * parseur communs — seuls l'entrée (`parseBareExpression`) et le vocabulaire de
 * variables (`CURVE_VARIABLES`) diffèrent.
 *
 * Grammaire couverte :
 *
 *   programme   := instruction+                    -- scripts Lua
 *   formule     := expr                            -- dynamicFormulaChangeCase
 *   instruction := 'if' expr 'then' 'return' expr ('else' 'return' expr)? 'end'
 *                | 'return' expr
 *   expr        := comparaison ( ('=='|'~='|'<'|'<='|'>'|'>=') comparaison )?
 *   comparaison := terme ( ('+'|'-') terme )*
 *   terme       := unaire ( ('*'|'/'|'%') unaire )*
 *   unaire      := '-' unaire | puissance
 *   puissance   := primaire ( '^' unaire )?        -- associatif à droite
 *   primaire    := nombre | variable | '#' variable
 *                | fonction '(' expr (',' expr)* ')' | '(' expr ')'
 *
 * Les priorités suivent Lua, y compris le fait que `^` lie plus fort que le
 * moins unaire (`-2^2` vaut `-4`) et que `%` est le modulo plancher de Lua
 * (`a - floor(a / b) * b`), qui diffère de `%` en JavaScript sur les négatifs.
 *
 * La valeur rendue n'est PAS arrondie : le jeu tronque le résultat en entier
 * long, mais les scripts qui en ont besoin appellent déjà `math.floor` ou
 * `math.ceil` eux-mêmes. L'arrondi éventuel reste la décision de l'appelant.
 */

/** Les seules variables que le game design injecte dans un script. */
export const LUA_VARIABLES = [
  "entityLevel",
  "keeperPurchaseCount",
  "playerAgeOrder",
  "entityAgeOrder",
] as const;

export type LuaVariable = (typeof LUA_VARIABLES)[number];

/**
 * Les variables des formules de table de paliers, écrites `#<nom>` dans le game
 * design (`DynamicFormulaCase.variableName`). Vocabulaire distinct de celui des
 * scripts Lua : un contexte n'admet jamais les variables de l'autre.
 */
export const CURVE_VARIABLES = ["level"] as const;

export type CurveVariable = (typeof CURVE_VARIABLES)[number];

const LUA_SCOPE: ReadonlySet<string> = new Set(LUA_VARIABLES);
const CURVE_SCOPE: ReadonlySet<string> = new Set(CURVE_VARIABLES.map((name) => `#${name}`));

const FUNCTIONS: Record<string, (args: number[]) => number> = {
  "math.floor": ([x]) => Math.floor(x),
  "math.ceil": ([x]) => Math.ceil(x),
  "math.max": (args) => Math.max(...args),
};

const ARITY: Record<string, number | null> = {
  "math.floor": 1,
  "math.ceil": 1,
  "math.max": null,
};

/** Toute sortie du sous-langage : script mal formé, variable absente, etc. */
export class LuaFormulaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LuaFormulaError";
  }
}

// ─── Analyse lexicale ────────────────────────────────────────────────────────

type TokenType = "nombre" | "nom" | "motclé" | "symbole";

interface Token {
  type: TokenType;
  value: string;
  position: number;
}

const KEYWORDS = new Set(["if", "then", "else", "end", "return"]);
const SYMBOLS = ["==", "~=", "<=", ">=", "+", "-", "*", "/", "%", "^", "<", ">", "(", ")", ","];

function tokenize(script: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < script.length) {
    const c = script[i];
    if (/\s/.test(c)) {
      i += 1;
      continue;
    }
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(script[i + 1] ?? ""))) {
      const match = /^[0-9]*\.?[0-9]+/.exec(script.slice(i));
      if (!match) throw new LuaFormulaError(`Nombre mal formé à la position ${i}.`);
      tokens.push({ type: "nombre", value: match[0], position: i });
      i += match[0].length;
      continue;
    }
    if (c === "#") {
      const match = /^#[A-Za-z_][A-Za-z_0-9]*/.exec(script.slice(i));
      if (!match) throw new LuaFormulaError(`Variable « # » mal formée à la position ${i}.`);
      tokens.push({ type: "nom", value: match[0], position: i });
      i += match[0].length;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      const match = /^[A-Za-z_][A-Za-z_0-9]*(\.[A-Za-z_][A-Za-z_0-9]*)*/.exec(script.slice(i))!;
      tokens.push({
        type: KEYWORDS.has(match[0]) ? "motclé" : "nom",
        value: match[0],
        position: i,
      });
      i += match[0].length;
      continue;
    }
    const symbol = SYMBOLS.find((s) => script.startsWith(s, i));
    if (!symbol) throw new LuaFormulaError(`Caractère inattendu « ${c} » à la position ${i}.`);
    tokens.push({ type: "symbole", value: symbol, position: i });
    i += symbol.length;
  }
  return tokens;
}

// ─── Arbre syntaxique ────────────────────────────────────────────────────────

type Expression =
  | { kind: "littéral"; value: number }
  | { kind: "variable"; name: string }
  | { kind: "appel"; name: string; args: Expression[] }
  | { kind: "unaire"; operand: Expression }
  | { kind: "binaire"; operator: string; left: Expression; right: Expression };

type Statement =
  | { kind: "retour"; value: Expression }
  | { kind: "si"; condition: Expression; then: Expression; else: Expression | null };

// ─── Analyse syntaxique ──────────────────────────────────────────────────────

class Parser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  parseProgram(): Statement[] {
    const statements: Statement[] = [];
    while (this.index < this.tokens.length) statements.push(this.parseStatement());
    if (statements.length === 0) throw new LuaFormulaError("Script vide : aucune instruction.");
    return statements;
  }

  /** Entrée des `dynamicFormulaChangeCase.formula` : une expression, et rien d'autre. */
  parseBareExpression(): Expression {
    if (this.tokens.length === 0) throw new LuaFormulaError("Formule vide : aucune expression.");
    const expression = this.parseExpression();
    const rest = this.peek();
    if (rest !== undefined) {
      throw new LuaFormulaError(
        `Fin de formule attendue, « ${rest.value} » trouvé à la position ${rest.position}.`,
      );
    }
    return expression;
  }

  private peek(): Token | undefined {
    return this.tokens[this.index];
  }

  private matches(type: TokenType, value: string): boolean {
    const token = this.peek();
    return token !== undefined && token.type === type && token.value === value;
  }

  private consume(type: TokenType, value: string): Token {
    const token = this.peek();
    if (!token || token.type !== type || token.value !== value) {
      const found = token ? `« ${token.value} »` : "la fin du script";
      throw new LuaFormulaError(`« ${value} » attendu, ${found} trouvé.`);
    }
    this.index += 1;
    return token;
  }

  private parseStatement(): Statement {
    if (this.matches("motclé", "return")) {
      this.index += 1;
      return { kind: "retour", value: this.parseExpression() };
    }
    if (this.matches("motclé", "if")) {
      this.index += 1;
      const condition = this.parseExpression();
      this.consume("motclé", "then");
      this.consume("motclé", "return");
      const thenValue = this.parseExpression();
      let elseValue: Expression | null = null;
      if (this.matches("motclé", "else")) {
        this.index += 1;
        this.consume("motclé", "return");
        elseValue = this.parseExpression();
      }
      this.consume("motclé", "end");
      return { kind: "si", condition, then: thenValue, else: elseValue };
    }
    const token = this.peek();
    throw new LuaFormulaError(
      token
        ? `Instruction inattendue « ${token.value} » à la position ${token.position}.`
        : "Fin de script inattendue.",
    );
  }

  private parseBinary(operators: string[], next: () => Expression, once = false): Expression {
    let left = next();
    while (this.peek()?.type === "symbole" && operators.includes(this.peek()!.value)) {
      const operator = this.tokens[this.index++].value;
      left = { kind: "binaire", operator, left, right: next() };
      if (once) break;
    }
    return left;
  }

  private parseExpression(): Expression {
    return this.parseBinary(["==", "~=", "<", "<=", ">", ">="], () => this.parseAdditive(), true);
  }

  private parseAdditive(): Expression {
    return this.parseBinary(["+", "-"], () => this.parseMultiplicative());
  }

  private parseMultiplicative(): Expression {
    return this.parseBinary(["*", "/", "%"], () => this.parseUnary());
  }

  private parseUnary(): Expression {
    if (this.matches("symbole", "-")) {
      this.index += 1;
      return { kind: "unaire", operand: this.parseUnary() };
    }
    return this.parsePower();
  }

  private parsePower(): Expression {
    const base = this.parsePrimary();
    if (!this.matches("symbole", "^")) return base;
    this.index += 1;
    return { kind: "binaire", operator: "^", left: base, right: this.parseUnary() };
  }

  private parsePrimary(): Expression {
    const token = this.peek();
    if (!token) throw new LuaFormulaError("Expression attendue, fin de script trouvée.");
    if (token.type === "nombre") {
      this.index += 1;
      return { kind: "littéral", value: Number(token.value) };
    }
    if (this.matches("symbole", "(")) {
      this.index += 1;
      const inner = this.parseExpression();
      this.consume("symbole", ")");
      return inner;
    }
    if (token.type === "nom") {
      this.index += 1;
      if (!this.matches("symbole", "(")) return { kind: "variable", name: token.value };
      if (!(token.value in FUNCTIONS)) {
        throw new LuaFormulaError(`Fonction non supportée : « ${token.value} ».`);
      }
      this.index += 1;
      const args: Expression[] = [this.parseExpression()];
      while (this.matches("symbole", ",")) {
        this.index += 1;
        args.push(this.parseExpression());
      }
      this.consume("symbole", ")");
      const arity = ARITY[token.value];
      if (arity !== null && args.length !== arity) {
        throw new LuaFormulaError(
          `« ${token.value} » attend ${arity} argument(s), ${args.length} fourni(s).`,
        );
      }
      return { kind: "appel", name: token.value, args };
    }
    throw new LuaFormulaError(
      `Expression attendue, « ${token.value} » trouvé à la position ${token.position}.`,
    );
  }
}

// ─── Évaluation ──────────────────────────────────────────────────────────────

type Value = number | boolean;

function asNumber(value: Value, context: string): number {
  if (typeof value !== "number") {
    throw new LuaFormulaError(`Nombre attendu ${context}, booléen trouvé.`);
  }
  return value;
}

const BINARY: Record<string, (a: Value, b: Value) => Value> = {
  "+": (a, b) => num(a, "+") + num(b, "+"),
  "-": (a, b) => num(a, "-") - num(b, "-"),
  "*": (a, b) => num(a, "*") * num(b, "*"),
  "/": (a, b) => num(a, "/") / num(b, "/"),
  "%": (a, b) => luaModulo(num(a, "%"), num(b, "%")),
  "^": (a, b) => num(a, "^") ** num(b, "^"),
  "==": (a, b) => a === b,
  "~=": (a, b) => a !== b,
  "<": (a, b) => num(a, "<") < num(b, "<"),
  "<=": (a, b) => num(a, "<=") <= num(b, "<="),
  ">": (a, b) => num(a, ">") > num(b, ">"),
  ">=": (a, b) => num(a, ">=") >= num(b, ">="),
};

function num(value: Value, operator: string): number {
  return asNumber(value, `pour l'opérateur « ${operator} »`);
}

/** Modulo plancher de Lua — diffère de `%` en JavaScript sur les négatifs. */
function luaModulo(a: number, b: number): number {
  return a - Math.floor(a / b) * b;
}

function evaluateExpression(
  node: Expression,
  variables: Record<string, number>,
  scope: ReadonlySet<string>,
): Value {
  switch (node.kind) {
    case "littéral":
      return node.value;
    case "variable": {
      if (!scope.has(node.name)) {
        throw new LuaFormulaError(`Variable inconnue du game design : « ${node.name} ».`);
      }
      const value = variables[node.name.replace(/^#/, "")];
      if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new LuaFormulaError(`Variable « ${node.name} » absente ou non numérique.`);
      }
      return value;
    }
    case "appel":
      return FUNCTIONS[node.name](
        node.args.map((arg, i) =>
          asNumber(
            evaluateExpression(arg, variables, scope),
            `en argument ${i + 1} de « ${node.name} »`,
          ),
        ),
      );
    case "unaire":
      return -asNumber(evaluateExpression(node.operand, variables, scope), "après le moins unaire");
    case "binaire":
      return BINARY[node.operator](
        evaluateExpression(node.left, variables, scope),
        evaluateExpression(node.right, variables, scope),
      );
  }
}

/** Sémantique Lua : seul `false` est faux — `0` est vrai. */
function isTruthy(value: Value): boolean {
  return value !== false;
}

/**
 * Évalue le texte brut d'un script du game design.
 *
 * @throws {LuaFormulaError} script hors du sous-langage, variable manquante,
 *   ou aucun `return` atteint.
 */
export function evaluateLuaFormula(script: string, variables: Record<string, number>): number {
  const statements = new Parser(tokenize(script)).parseProgram();
  for (const statement of statements) {
    if (statement.kind === "retour") {
      return asNumber(
        evaluateExpression(statement.value, variables, LUA_SCOPE),
        "en valeur de retour",
      );
    }
    if (isTruthy(evaluateExpression(statement.condition, variables, LUA_SCOPE))) {
      return asNumber(
        evaluateExpression(statement.then, variables, LUA_SCOPE),
        "en valeur de retour",
      );
    }
    if (statement.else !== null) {
      return asNumber(
        evaluateExpression(statement.else, variables, LUA_SCOPE),
        "en valeur de retour",
      );
    }
  }
  throw new LuaFormulaError("Aucun « return » atteint : le script n'a pas de valeur par défaut.");
}

/**
 * Évalue une `dynamicFormulaChangeCase.formula` — expression nue, variable
 * préfixée `#` (`"(#level + 18) * 5"`).
 *
 * La valeur rendue n'est pas plus arrondie que celle des scripts Lua, et ne dit
 * rien de l'articulation table/formule (docs/game-schema/02-dynamic.md §5.1) :
 * la borne `valueLimit` reste la décision de l'appelant.
 *
 * @throws {LuaFormulaError} formule hors du sous-langage ou variable manquante.
 */
export function evaluateCurveFormula(
  formula: string,
  variables: Record<CurveVariable, number>,
): number {
  const expression = new Parser(tokenize(formula)).parseBareExpression();
  return asNumber(evaluateExpression(expression, variables, CURVE_SCOPE), "en valeur de formule");
}

/** Les variables réellement lues par un script — utile pour savoir quoi injecter. */
export function collectLuaVariables(script: string): LuaVariable[] {
  const found = new Set<LuaVariable>();
  const visitExpression = (node: Expression): void => {
    switch (node.kind) {
      case "variable":
        if ((LUA_VARIABLES as readonly string[]).includes(node.name)) {
          found.add(node.name as LuaVariable);
        }
        return;
      case "appel":
        node.args.forEach(visitExpression);
        return;
      case "unaire":
        visitExpression(node.operand);
        return;
      case "binaire":
        visitExpression(node.left);
        visitExpression(node.right);
    }
  };
  for (const statement of new Parser(tokenize(script)).parseProgram()) {
    if (statement.kind === "retour") visitExpression(statement.value);
    else {
      visitExpression(statement.condition);
      visitExpression(statement.then);
      if (statement.else) visitExpression(statement.else);
    }
  }
  return LUA_VARIABLES.filter((name) => found.has(name));
}

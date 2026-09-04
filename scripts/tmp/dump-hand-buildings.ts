import { ELEMENT_DATA_REGISTRY } from "../../data/registry";
const out: unknown[] = [];
for (const [key, d] of Object.entries(ELEMENT_DATA_REGISTRY)) {
  const lv = d.levels.map((l) => l.level);
  out.push({
    key, id: d.id, name: d.name, category: d.category, subcategory: d.subcategory,
    imageName: d.imageName,
    n: d.levels.length, min: Math.min(...lv), max: Math.max(...lv),
    eras: [...new Set(d.levels.map((l) => l.era))].join(","),
  });
}
process.stdout.write(JSON.stringify(out, null, 1));

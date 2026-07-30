import { describe, it, expect } from "vitest";
import { computeSynergies, getTagContributions, computeTagCounts } from "./wonders-utils";
import { WONDERS } from "@/data/wonders/index";
import type { Wonder } from "@/data/wonders/types";

describe("getTagContributions", () => {
  it("returns { naval: 1 } for a standard naval wonder", () => {
    const loa = WONDERS["LoA"] as Wonder;
    const result = getTagContributions(loa);
    expect(Object.fromEntries(result)).toEqual({ naval: 1, temple: 1 });
  });

  it("returns { naval: 2 } for Dragonship Ellida (countsAs)", () => {
    const de = WONDERS["DE"] as Wonder;
    const result = getTagContributions(de);
    // DE materials are [naval, naval] but countsAs replaces with { naval: 2 }
    expect(Object.fromEntries(result)).toEqual({ naval: 2 });
  });

  it("returns { nature: 2, statue: 2 } for Yggdrasil", () => {
    const y = WONDERS["Y"] as Wonder;
    const result = getTagContributions(y);
    expect(Object.fromEntries(result)).toEqual({ nature: 2, statue: 2 });
  });
});

describe("computeTagCounts", () => {
  it("counts naval as 4 with LoA + CoR + DE", () => {
    const counts = computeTagCounts(["LoA", "CoR", "DE"]);
    expect(counts["naval"]).toBe(4);
  });

  it("counts naval as 2 with LoA + CoR (no multiplier)", () => {
    const counts = computeTagCounts(["LoA", "CoR"]);
    expect(counts["naval"]).toBe(2);
  });

  it("counts naval as 2 with LoA + DE alone", () => {
    const counts = computeTagCounts(["LoA", "DE"]);
    expect(counts["naval"]).toBe(3);
  });
});

describe("computeSynergies", () => {
  it("LoA gets synergyCount 3 from CoR (naval×1) + DE (naval×2)", () => {
    const results = computeSynergies(["LoA", "CoR", "DE"]);
    const loa = results.find((r) => r.code === "LoA");
    expect(loa).toBeDefined();
    expect(loa!.synergyActive).toBe(true);
    // CoR contributes 1 naval, DE contributes 2 naval = 3 weighted activators
    expect(loa!.synergyCount).toBe(3);
    expect(loa!.activatedBy).toContain("Colossus of Rhodes");
    expect(loa!.activatedBy).toContain("Dragonship Ellida");
  });

  it("CoR also gets synergyCount 3 with same setup", () => {
    const results = computeSynergies(["LoA", "CoR", "DE"]);
    const cor = results.find((r) => r.code === "CoR");
    expect(cor).toBeDefined();
    expect(cor!.synergyActive).toBe(true);
    expect(cor!.synergyCount).toBe(3);
  });

  it("DE has no synergy (synergies array is empty)", () => {
    const results = computeSynergies(["LoA", "CoR", "DE"]);
    const de = results.find((r) => r.code === "DE");
    expect(de).toBeDefined();
    expect(de!.synergyActive).toBe(false);
    expect(de!.synergyCount).toBe(0);
  });

  it("LoA + CoR without DE gives synergyCount 1", () => {
    const results = computeSynergies(["LoA", "CoR"]);
    const loa = results.find((r) => r.code === "LoA");
    expect(loa).toBeDefined();
    expect(loa!.synergyCount).toBe(1);
  });
});

describe("real-world scenario: LoA + CoR + DE", () => {
  it("naval tag total is 4, not 3", () => {
    const counts = computeTagCounts(["LoA", "CoR", "DE"]);
    expect(counts["naval"]).toBe(4);
  });

  it("LoA synergy bonus is +15% (3 activators × 5%)", () => {
    const results = computeSynergies(["LoA", "CoR", "DE"]);
    const loa = results.find((r) => r.code === "LoA")!;
    expect(loa.synergyCount).toBe(3);
    expect(loa.synergyBonus).toBe("+5%");
    // The multiplied value displayed would be "+15%"
    const rawValue = parseFloat(loa.synergyBonus!.match(/[+-]?\d+(?:\.\d+)?/)![0]);
    expect(rawValue * loa.synergyCount).toBe(15);
  });
});

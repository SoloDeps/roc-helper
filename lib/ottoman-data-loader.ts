"use client";

import { areas_table, trade_post_table } from "@/data/ottoman";
import type { OttomanAreaData, TradePostData } from "@/types/shared";

/**
 * Get all available Ottoman areas
 */
export function getAvailableAreas(): number[] {
  return Object.keys(areas_table)
    .map(Number)
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);
}

/**
 * Get area data by area index
 */
export function getAreaData(
  areaIndex: number,
): Array<{ amount: number; resource: string }> | undefined {
  return areas_table[areaIndex];
}

/**
 * Get all trade posts
 */
export function getAllTradePosts(): TradePostData[] {
  return trade_post_table;
}

/**
 * Get trade posts by area
 */
export function getTradePostsByArea(area: number): TradePostData[] {
  return trade_post_table.filter((tp) => tp.area === area);
}

/**
 * Get trade post by name
 */
export function getTradePostByName(name: string): TradePostData | undefined {
  return trade_post_table.find((tp) => tp.name === name);
}

/**
 * Check if area has any data
 */
export function hasAreaData(areaIndex: number): boolean {
  const data = areas_table[areaIndex];
  return Array.isArray(data) && data.length > 0;
}

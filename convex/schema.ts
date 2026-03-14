import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  fortunes: defineTable({
    name: v.string(),
    gender: v.string(),
    birthDate: v.string(),
    birthTime: v.string(),
    category: v.string(),
    question: v.string(),
    result: v.string(),
    cacheKey: v.string(),
    createdAt: v.number(),
  }).index("by_cache", ["cacheKey"]),
});

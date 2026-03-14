import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  fortunes: defineTable({
    cacheKey: v.string(),
    user: v.object({
      name: v.string(),
      gender: v.string(),
      birthDate: v.string(),
      birthTime: v.string(),
      category: v.string(),
      question: v.string(),
    }),
    analysis: v.any(),
    result: v.string(),
    createdAt: v.number(),
  }).index("by_cacheKey", ["cacheKey"]),
});

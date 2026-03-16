import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const partnerValidator = v.object({
  name: v.string(),
  gender: v.string(),
  calendarType: v.string(),
  birthDate: v.string(),
  birthTime: v.string(),
});

export default defineSchema({
  fortunes: defineTable({
    cacheKey: v.string(),
    user: v.object({
      name: v.string(),
      gender: v.string(),
      calendarType: v.string(),
      birthDate: v.string(),
      birthTime: v.string(),
      category: v.string(),
      question: v.string(),
      partner: v.optional(partnerValidator),
    }),
    analysis: v.any(),
    result: v.string(),
    createdAt: v.number(),
  }).index("by_cacheKey", ["cacheKey"]),
});

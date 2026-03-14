import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByCacheKey = query({
  args: {
    cacheKey: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fortunes")
      .withIndex("by_cacheKey", (q) => q.eq("cacheKey", args.cacheKey))
      .first();
  },
});

export const getFortune = query({
  args: {
    id: v.id("fortunes"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createFortune = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("fortunes", args);
  },
});

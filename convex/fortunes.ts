import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveFortune = mutation({
  args: {
    name: v.string(),
    gender: v.string(),
    birthDate: v.string(),
    birthTime: v.string(),
    category: v.string(),
    question: v.string(),
    result: v.string(),
    cacheKey: v.string(),
  },

  handler: async (ctx, args) => {
    const cached = await ctx.db
      .query("fortunes")
      .withIndex("by_cache", (q) => q.eq("cacheKey", args.cacheKey))
      .first();

    if (cached) {
      return cached._id;
    }

    const id = await ctx.db.insert("fortunes", {
      ...args,
      createdAt: Date.now(),
    });

    return id;
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

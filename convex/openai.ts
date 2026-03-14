"use node";

import OpenAI from "openai";
import { v } from "convex/values";
import { action, type ActionCtx } from "./_generated/server";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

import { analyzeSaju } from "../lib/saju/analyzeSaju";
import { createSajuPrompt } from "../lib/saju/sajuPrompt";

type GenerateFortuneArgs = {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  category: string;
  question: string;
};

const generateFortuneHandler = async (
  ctx: ActionCtx,
  user: GenerateFortuneArgs,
): Promise<Id<"fortunes">> => {
  const cacheKey = [
    user.name,
    user.gender,
    user.birthDate,
    user.birthTime,
    user.category,
    user.question,
  ].join("-");

  const cached = await ctx.runQuery(api.fortunes.getByCacheKey, {
    cacheKey,
  });

  if (cached) {
    return cached._id;
  }

  const analysis = analyzeSaju(user);
  const prompt = createSajuPrompt(user, analysis);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "당신은 한국 전통 명리학을 바탕으로 현실적으로 상담하는 사주 전문가입니다.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1800,
  });

  const result =
    response.choices?.[0]?.message?.content ??
    "운세 분석 결과를 생성하지 못했습니다.";

  const id = await ctx.runMutation(api.fortunes.createFortune, {
    cacheKey,
    user,
    analysis,
    result,
    createdAt: Date.now(),
  });

  return id;
};

export const generateFortune = action({
  args: {
    name: v.string(),
    gender: v.string(),
    birthDate: v.string(),
    birthTime: v.string(),
    category: v.string(),
    question: v.string(),
  },
  handler: generateFortuneHandler,
});

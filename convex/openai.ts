"use node";

import OpenAI from "openai";
import { v } from "convex/values";
import { action, type ActionCtx } from "./_generated/server";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

import { analyzeSaju } from "../lib/saju/analyzeSaju";
import { analyzeCompatibility } from "../lib/saju/compatibility";
import {
  createCompatibilityPrompt,
  createSajuPrompt,
} from "../lib/saju/sajuPrompt";
import type {
  CalendarType,
  CompatibilityAnalysis,
  FortuneCategory,
  Gender,
  UserFortuneInput,
} from "../lib/saju/types";

type PartnerArgs = {
  name: string;
  gender: string;
  calendarType: string;
  birthDate: string;
  birthTime: string;
};

type GenerateFortuneArgs = {
  name: string;
  gender: string;
  calendarType: string;
  birthDate: string;
  birthTime: string;
  category: string;
  question: string;
  partner?: PartnerArgs;
};

const GENDERS = ["male", "female"] as const;

const FORTUNE_CATEGORIES = [
  "love",
  "reunion",
  "crush",
  "contact",
  "compatibility",
  "money",
  "career",
  "business",
  "year",
  "life",
] as const;

const CALENDAR_TYPES = ["solar", "lunar"] as const;

function isGender(value: string): value is Gender {
  return (GENDERS as readonly string[]).includes(value);
}

function isFortuneCategory(value: string): value is FortuneCategory {
  return (FORTUNE_CATEGORIES as readonly string[]).includes(value);
}

function isCalendarType(value: string): value is CalendarType {
  return (CALENDAR_TYPES as readonly string[]).includes(value);
}

function parseGender(value: string): Gender {
  return isGender(value) ? value : "male";
}

function parseCategory(value: string): FortuneCategory {
  return isFortuneCategory(value) ? value : "life";
}

function parseCalendarType(value?: string): CalendarType | undefined {
  if (!value) return undefined;
  return isCalendarType(value) ? value : "solar";
}

function buildCacheKey(user: GenerateFortuneArgs) {
  return JSON.stringify({
    name: user.name,
    gender: parseGender(user.gender),
    calendarType: parseCalendarType(user.calendarType) ?? "solar",
    birthDate: user.birthDate,
    birthTime: user.birthTime,
    category: parseCategory(user.category),
    question: user.question,
    partner: user.partner
      ? {
          ...user.partner,
          gender: parseGender(user.partner.gender),
          calendarType: parseCalendarType(user.partner.calendarType) ?? "solar",
        }
      : null,
  });
}

function toUserFortuneInput(user: GenerateFortuneArgs): UserFortuneInput {
  return {
    name: user.name,
    gender: parseGender(user.gender),
    calendarType: parseCalendarType(user.calendarType),
    birthDate: user.birthDate,
    birthTime: user.birthTime,
    category: parseCategory(user.category),
    question: user.question,
  };
}

function toPartnerFortuneInput(
  user: GenerateFortuneArgs,
): UserFortuneInput | null {
  if (!user.partner) return null;

  return {
    name: user.partner.name,
    gender: parseGender(user.partner.gender),
    calendarType: parseCalendarType(user.partner.calendarType),
    birthDate: user.partner.birthDate,
    birthTime: user.partner.birthTime,
    category: "compatibility",
    question: user.question,
  };
}

const generateFortuneHandler = async (
  ctx: ActionCtx,
  user: GenerateFortuneArgs,
): Promise<Id<"fortunes">> => {
  const cacheKey = buildCacheKey(user);

  const cached = await ctx.runQuery(api.fortunes.getByCacheKey, {
    cacheKey,
  });

  if (cached) {
    return cached._id;
  }

  const me = toUserFortuneInput(user);
  const partner = toPartnerFortuneInput(user);
  const isCompatibility = me.category === "compatibility" && !!partner;

  const myAnalysis = analyzeSaju(me);
  const partnerAnalysis =
    isCompatibility && partner ? analyzeSaju(partner) : null;

  const compatibility =
    isCompatibility && partnerAnalysis
      ? analyzeCompatibility(myAnalysis, partnerAnalysis)
      : null;

  const analysis: CompatibilityAnalysis | typeof myAnalysis =
    isCompatibility && partnerAnalysis && compatibility
      ? {
          ...myAnalysis,
          partnerAnalysis,
          compatibility,
        }
      : myAnalysis;

  const prompt =
    isCompatibility && partner && partnerAnalysis && compatibility
      ? createCompatibilityPrompt(
          me,
          partner,
          myAnalysis,
          partnerAnalysis,
          compatibility,
        )
      : createSajuPrompt(me, myAnalysis);

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
    user: {
      ...me,
      calendarType: me.calendarType ?? "solar",
      ...(user.partner
        ? {
            partner: {
              ...user.partner,
              gender: parseGender(user.partner.gender),
              calendarType:
                parseCalendarType(user.partner.calendarType) ?? "solar",
            },
          }
        : {}),
    },
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
    calendarType: v.string(),
    birthDate: v.string(),
    birthTime: v.string(),
    category: v.string(),
    question: v.string(),
    partner: v.optional(
      v.object({
        name: v.string(),
        gender: v.string(),
        calendarType: v.string(),
        birthDate: v.string(),
        birthTime: v.string(),
      }),
    ),
  },
  handler: generateFortuneHandler,
});

import { action, ActionCtx } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const generateFortune = action({
  args: {
    name: v.string(),
    gender: v.string(),
    birthDate: v.string(),
    birthTime: v.string(),
    category: v.string(),
    question: v.string(),
  },

  handler: async (ctx: ActionCtx, args): Promise<Id<"fortunes">> => {
    const cacheKey = `${args.name}-${args.gender}-${args.birthDate}-${args.birthTime}-${args.category}-${args.question}`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const today = new Date().toISOString().split("T")[0];
    const prompt = `
    오늘 날짜: ${today}
    
당신은 30년 경력의 한국 전통 명리학 사주 전문가입니다.
수천 명의 상담 경험을 가진 실제 사주 상담가처럼 분석합니다.

[중요 규칙]
현재 시점은 ${today} 입니다.
모든 운세 해석은 반드시 현재 시점을 기준으로 설명합니다.

[분석 규칙]

1. 반드시 동양 명리학 사주 이론 기반으로 해석합니다.
2. 사용자의 생년월일과 태어난 시간을 중심으로 사주 흐름을 설명합니다.
3. 상담 카테고리에 집중하여 풀이합니다.
4. 단순 운세가 아니라 "왜 그런 흐름이 생기는지" 설명합니다.
5. 실제 상담처럼 자연스럽고 몰입감 있게 작성합니다.

[사용자 정보]

이름: ${args.name}
성별: ${args.gender}
생년월일: ${args.birthDate}
태어난 시간: ${args.birthTime}

상담 카테고리: ${args.category}

사용자 질문
${args.question}

[분석 내용]

다음 구조로 사주를 풀이하세요.

1️⃣ 현재 사주 흐름
- 지금 인생 흐름이 어떤 시기인지 설명

2️⃣ 사주 성향 분석
- 타고난 성격과 운의 구조

3️⃣ ${args.category} 중심 운세
- 선택한 상담 카테고리 중심으로 분석
- 실제 상황처럼 구체적으로 설명

4️⃣ 현실적인 조언
- 지금 해야 할 행동
- 피해야 할 선택

5️⃣ 미래 사건의 시작
- 가까운 미래에 일어날 수 있는 흐름 설명
- 사건이 시작되는 순간 직전에 문장을 끊으세요

[작성 스타일]

- 실제 사주 상담처럼 자연스럽게 작성
- 각 섹션(1️⃣, 2️⃣ 등) 사이에는 반드시 빈 줄을 두 번 넣어 문단을 확실히 구분하세요.
- 각 문단 내에서도 가독성을 위해 내용이 바뀔 때 줄바꿈을 자주 사용하세요.
- 최소 1200자 이상
- 지나치게 단정하지 말고 흐름 중심 설명
- 몰입감 있는 스토리형 문장
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content:
            "당신은 한국 최고의 사주 명리학 전문가이며 실제 상담가처럼 운세를 풀이합니다.",
        },
        { role: "user", content: prompt },
      ],
    });

    const result = completion.choices[0].message.content ?? "";

    const id: Id<"fortunes"> = await ctx.runMutation(api.fortunes.saveFortune, {
      name: args.name,
      gender: args.gender,
      birthDate: args.birthDate,
      birthTime: args.birthTime,
      category: args.category,
      question: args.question,
      result,
      cacheKey,
    });

    return id;
  },
});

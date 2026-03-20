import { UserFortuneInput, SajuAnalysis, CompatibilitySummary } from "./types";
import { TEN_GOD_LABELS } from "./stemsBranches";

const CATEGORY_LABEL_MAP: Record<string, string> = {
  love: "연애운",
  reunion: "재회 가능성",
  crush: "짝사랑 성공률",
  contact: "연락운",
  compatibility: "궁합 분석",
  money: "재물운",
  career: "직장운",
  business: "사업운",
  year: "올해 운세",
  life: "인생 방향",
};

function getCategoryLabel(category?: string) {
  return CATEGORY_LABEL_MAP[category ?? ""] ?? "운세";
}

function categoryGuide(category: string) {
  const normalized = category?.trim();
  switch (normalized) {
    case "love":
    case "reunion":
    case "crush":
    case "contact":
      return "관계 흐름, 감정 표현, 거리 조절, 만남/연락 패턴 위주로 해석하세요.";
    case "money":
      return "수입 구조, 지출 습관, 기회 포착, 무리한 투자 회피 위주로 해석하세요.";
    case "career":
    case "business":
      return "직장 적응, 역할 책임, 성과 방식, 대인관계, 평판 이슈 위주로 해석하세요.";
    case "year":
    case "life":
      return "원국과 대운·세운의 큰 흐름을 연결해서 현실적인 방향성 위주로 해석하세요.";
    case "compatibility":
      return "두 사람의 차이와 보완 포인트를 현실적인 관계 운영 관점에서 설명하세요.";
    default:
      return "사용자 질문을 최우선으로 두고 원국, 대운, 세운, 월운을 현실 문제와 연결해 설명하세요.";
  }
}

function formatTenGodLabel(value: string) {
  return TEN_GOD_LABELS[value as keyof typeof TEN_GOD_LABELS] ?? value;
}

function formatTenGodList(values: string[]) {
  if (!Array.isArray(values) || values.length === 0)
    return "특별히 두드러진 항목 없음";
  return values.map(formatTenGodLabel).join(", ");
}

function formatTenGodEntries(values: Record<string, number>) {
  const entries = Object.entries(values ?? {});
  if (!entries.length) return "데이터 없음";

  return entries
    .map(([key, value]) => `${formatTenGodLabel(key)} ${value}`)
    .join(", ");
}

export function createSajuPrompt(
  user: UserFortuneInput,
  analysis: SajuAnalysis,
): string {
  const {
    saju,
    elements,
    strength,
    yongsin,
    daewoon,
    sewoonDetail,
    tenGods,
    relations,
    monthlyFortune,
    summary,
  } = analysis;

  const today = new Date().toISOString().split("T")[0];
  const categoryLabel = getCategoryLabel(user.category);

  return `
오늘 날짜: ${today}

당신은 한국식 사주 해석을 바탕으로 현실적인 조언을 제공하는 전문 상담가입니다.
과장된 예언, 단정적인 미래 확정, 질병·사망 예측, 공포 조장은 금지합니다.
반드시 제공된 계산 결과만 바탕으로 해석하세요.
${categoryGuide(user.category)}

매우 중요:
- 답변은 반드시 한국어 존댓말로만 작성하세요.
- "career", "love", "money" 같은 영문 카테고리 id를 절대 본문에 쓰지 마세요.
- 반드시 아래의 마크다운 형식을 정확히 지키세요.
- 각 큰 제목은 반드시 "## "로 시작하세요.
- 필요한 경우 소제목은 "### "로 시작하세요.
- 문단 사이에는 줄바꿈을 넣어 가독성을 높이세요.
- 실천 조언은 반드시 bullet list(-)로 작성하세요.
- "1. career 운세" 같은 표현은 금지하고, 반드시 "${categoryLabel}"처럼 자연스러운 한글 제목을 사용하세요.

[사용자 정보]
이름: ${user.name}
성별: ${user.gender === "male" ? "남성" : "여성"}
질문 카테고리: ${categoryLabel}
질문: ${user.question}

[핵심 요약]
핵심 메시지: ${summary.coreMessage}
일간: ${summary.dayMaster} (${summary.dayElement})
신강/신약: ${summary.strength}
균형도: ${summary.balance.level} (격차 ${summary.balance.gap})
강한 오행: ${summary.dominantElements.join(", ")}
약한 오행: ${summary.lackingElements.join(", ")}
용신/희신/기신: ${summary.yongsin} / ${summary.heesin} / ${summary.gisin}
강한 십성: ${formatTenGodList(summary.dominantTenGods)}
약한 십성: ${formatTenGodList(summary.weakTenGods)}
관계 하이라이트: ${summary.relationHighlights.join(" | ") || "특별한 강한 충돌 없음"}
좋은 월: ${summary.goodMonths
    .map((item) => `${item.month}월(${item.pillar}, ${item.score}점)`)
    .join(", ")}
주의 월: ${summary.cautionMonths
    .map((item) => `${item.month}월(${item.pillar}, ${item.score}점)`)
    .join(", ")}

[사주 원국]
년주: ${saju.year}
월주: ${saju.month}
일주: ${saju.day}
시주: ${saju.hour}

[오행 총량]
목: ${elements.wood}
화: ${elements.fire}
토: ${elements.earth}
금: ${elements.metal}
수: ${elements.water}

[강약 판단]
일간 오행: ${strength.dayElement}
신강/신약: ${strength.strength}
점수: ${strength.score}
계절 보정: ${strength.seasonSupport}
통근 개수: ${strength.rootCount}
해석 메모: ${strength.summary}
유리한 오행: ${strength.favorableElements.join(", ")}
주의 오행: ${strength.unfavorableElements.join(", ")}

[용신 판단]
용신: ${yongsin.yongsin}
희신: ${yongsin.heesin}
기신: ${yongsin.gisin}
판단 이유: ${yongsin.reason}

[십성 분포]
주요 십성: ${formatTenGodList(tenGods.dominant)}
약한 십성: ${formatTenGodList(tenGods.weak)}
총평: ${tenGods.summary}
세부 분포: ${formatTenGodEntries(tenGods.total)}

[대운/세운]
현재 나이: ${daewoon.currentAge}
대운 시작 나이 추정: ${daewoon.startAge}
대운 방향: ${daewoon.direction === "forward" ? "순행" : "역행"}
현재 대운: ${daewoon.daewoon}
올해 세운: ${sewoonDetail.pillar} / ${sewoonDetail.relation} / ${sewoonDetail.score}점
세운 키워드: ${sewoonDetail.keywords.join(", ")}
세운 메모: ${sewoonDetail.note}

[합충형파해]
원국 관계: ${
    relations.natal.length
      ? relations.natal
          .map((item) => `${item.source}-${item.target} ${item.type}`)
          .join(", ")
      : "특기할 강한 작용 없음"
  }
세운 관계: ${
    relations.year.length
      ? relations.year
          .map((item) => `${item.source}-${item.target} ${item.type}`)
          .join(", ")
      : "특기할 강한 작용 없음"
  }
요약: ${relations.summary}

[월운]
${monthlyFortune
  .map(
    (item) =>
      `${item.month}월 ${item.pillar} ${item.score}점 ${item.keywords.join("/")} - ${item.note}`,
  )
  .join("\n")}

반드시 아래 형식 그대로만 작성하세요.

## 1. 현재 인생 흐름

원국, 대운, 세운을 함께 묶어서 현재 흐름을 설명하세요.

## 2. 사주 구조 핵심

- 일간 성향
- 강약 판단 근거
- 십성 특징
- 합충형파해가 성격과 삶의 패턴에 주는 영향
- 용신과 희신을 생활 방식과 연결한 설명

## 3. ${categoryLabel}

좋은 흐름과 조심할 흐름을 모두 설명하고, 추상적인 표현보다 현실적인 상황 중심으로 풀어 설명하세요.

## 4. 시기 포인트

- 올해 흐름
- 상대적으로 좋은 월 2~3개
- 조심할 월 2~3개

## 5. 실천 조언

- 바로 적용 가능한 행동 지침 3~5개를 bullet list로 작성하세요.
- 각 조언은 짧고 현실적으로 쓰세요.

## 6. 마무리

차분하게 한 문단으로 정리하세요.

문체 조건:
- 한국어 존댓말
- 1400~2200자
- 단정적 예언체 금지
- 겁주는 표현 금지
- 현실 상담처럼 자연스럽게 작성
`;
}

export function createCompatibilityPrompt(
  me: UserFortuneInput,
  other: UserFortuneInput,
  myAnalysis: SajuAnalysis,
  otherAnalysis: SajuAnalysis,
  compatibility: CompatibilitySummary,
): string {
  return `
당신은 한국식 명리 상담가입니다. 단정적 예언 없이 현실적인 궁합 상담을 작성하세요.

매우 중요:
- 답변은 반드시 한국어 존댓말로만 작성하세요.
- 반드시 아래 마크다운 형식을 정확히 지키세요.
- 각 큰 제목은 반드시 "## "로 시작하세요.
- 문단 사이에는 적절히 줄바꿈 하세요.
- bullet list가 필요한 곳은 "-"를 사용하세요.

[나]
이름: ${me.name}
일주: ${myAnalysis.saju.day}
핵심: ${myAnalysis.summary.coreMessage}

[상대]
이름: ${other.name}
일주: ${otherAnalysis.saju.day}
핵심: ${otherAnalysis.summary.coreMessage}

[궁합 계산 요약]
점수: ${compatibility.score}
등급: ${compatibility.grade}
강점: ${compatibility.strengths.join(" | ")}
주의점: ${compatibility.cautions.join(" | ")}
요약: ${compatibility.summary}

반드시 아래 구조로만 작성하세요.

## 1. 관계의 기본 결

두 사람 관계의 기본적인 성향과 분위기를 설명하세요.

## 2. 잘 맞는 지점

- 잘 맞는 점을 2~3가지로 설명하세요.

## 3. 부딪히기 쉬운 지점

- 현실적으로 조심해야 할 부분을 설명하세요.

## 4. 오래 가려면 필요한 태도

- 관계를 건강하게 유지하기 위한 태도를 bullet list로 작성하세요.

## 5. 마무리

짧고 따뜻하게 정리하세요.

문체 조건:
- 900~1400자
- 한국어 존댓말
- 단정적 예언 금지
- 현실적이고 따뜻한 상담체
`;
}

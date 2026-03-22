import { UserFortuneInput, SajuAnalysis, CompatibilitySummary } from "./types";
import { TEN_GOD_LABELS } from "./stemsBranches";

const CATEGORY_LABEL_MAP: Record<string, string> = {
  love: "연애운",
  reunion: "재회 가능성",
  crush: "짝사랑 흐름",
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
  switch (category) {
    case "love":
    case "reunion":
    case "crush":
    case "contact":
      return "감정 흐름, 관계 거리감, 타이밍, 표현 방식 중심으로 현실적으로 해석하세요.";
    case "money":
      return "돈을 벌고 지키는 방식, 소비 습관, 무리수 위험, 기회 포착 관점으로 해석하세요.";
    case "career":
    case "business":
      return "일하는 스타일, 조직 적응력, 성과 방식, 책임감, 커리어 방향 중심으로 해석하세요.";
    case "year":
    case "life":
      return "원국과 현재 운의 흐름을 묶어서 올해와 앞으로의 방향성을 설명하세요.";
    case "compatibility":
      return "두 사람의 차이, 맞는 점, 부딪히는 지점, 관계 운영 팁을 현실적으로 설명하세요.";
    default:
      return "사용자 질문에 맞춰 성향, 흐름, 시기, 실천 방향을 쉽게 풀어 설명하세요.";
  }
}

function formatTenGodLabel(value: string) {
  return TEN_GOD_LABELS[value as keyof typeof TEN_GOD_LABELS] ?? value;
}

function formatTenGodList(values: string[]) {
  if (!Array.isArray(values) || values.length === 0)
    return "두드러진 요소 없음";
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

당신은 한국식 사주를 현대적으로 쉽게 풀어주는 전문 해설가입니다.
반드시 제공된 계산 결과만 바탕으로 해석하세요.
${categoryGuide(user.category)}

절대 규칙:
- 반드시 한국어 존댓말로 작성하세요.
- 어려운 한자 용어를 남발하지 마세요.
- "신강", "신약", "용신", "십성" 같은 용어를 쓰더라도 바로 쉬운 말로 풀어 설명하세요.
- 공포 조장, 단정적 예언, 질병/사망/파멸 같은 표현은 금지합니다.
- 사용자가 읽기 쉽게 "해설형 콘텐츠"처럼 써주세요.
- 영문 카테고리 id(love, career 등)는 절대 본문에 쓰지 마세요.
- 결과는 반드시 아래 형식을 정확히 지키세요.

[사용자 정보]
이름: ${user.name}
성별: ${user.gender === "male" ? "남성" : "여성"}
질문 카테고리: ${categoryLabel}
질문: ${user.question}

[핵심 계산 데이터]
핵심 메시지: ${summary.coreMessage}
일간: ${summary.dayMaster} (${summary.dayElement})
신강/신약: ${summary.strength}
균형도: ${summary.balance.level}
강한 오행: ${summary.dominantElements.join(", ")}
약한 오행: ${summary.lackingElements.join(", ")}
용신: ${summary.yongsin}
희신: ${summary.heesin}
기신: ${summary.gisin}
강한 십성: ${formatTenGodList(summary.dominantTenGods)}
약한 십성: ${formatTenGodList(summary.weakTenGods)}
관계 하이라이트: ${summary.relationHighlights.join(" | ") || "특별한 강한 충돌 없음"}

[사주 원국]
년주: ${saju.year}
월주: ${saju.month}
일주: ${saju.day}
시주: ${saju.hour}

[오행]
목: ${elements.wood}
화: ${elements.fire}
토: ${elements.earth}
금: ${elements.metal}
수: ${elements.water}

[강약 판단]
일간 오행: ${strength.dayElement}
강약: ${strength.strength}
점수: ${strength.score}
계절 보정: ${strength.seasonSupport}
통근 개수: ${strength.rootCount}
요약: ${strength.summary}
유리한 오행: ${strength.favorableElements.join(", ")}
주의 오행: ${strength.unfavorableElements.join(", ")}

[용신 판단]
용신: ${yongsin.yongsin}
희신: ${yongsin.heesin}
기신: ${yongsin.gisin}
이유: ${yongsin.reason}

[십성 분포]
주요 십성: ${formatTenGodList(tenGods.dominant)}
약한 십성: ${formatTenGodList(tenGods.weak)}
총평: ${tenGods.summary}
세부 분포: ${formatTenGodEntries(tenGods.total)}

[대운/세운]
현재 나이: ${daewoon.currentAge}
대운 시작 나이: ${daewoon.startAge}
대운 방향: ${daewoon.direction === "forward" ? "순행" : "역행"}
현재 대운: ${daewoon.daewoon}
올해 세운: ${sewoonDetail.pillar}
올해 세운 관계: ${sewoonDetail.relation}
올해 세운 점수: ${sewoonDetail.score}
올해 키워드: ${sewoonDetail.keywords.join(", ")}
올해 메모: ${sewoonDetail.note}

[합충형파해]
원국 관계: ${
    relations.natal.length
      ? relations.natal
          .map((item) => `${item.source}-${item.target} ${item.type}`)
          .join(", ")
      : "강한 작용 없음"
  }
세운 관계: ${
    relations.year.length
      ? relations.year
          .map((item) => `${item.source}-${item.target} ${item.type}`)
          .join(", ")
      : "강한 작용 없음"
  }
관계 요약: ${relations.summary}

[월운]
${monthlyFortune
  .map(
    (item) =>
      `${item.month}월 ${item.pillar} ${item.score}점 ${item.keywords.join("/")} - ${item.note}`,
  )
  .join("\n")}

반드시 아래 형식으로만 작성하세요.

## 한줄 총평

2~3문장으로, 이 사람의 현재 흐름을 가장 쉽게 이해할 수 있게 요약하세요.

## 내 사주의 핵심 성향

- 어떤 기질이 강한 사람인지
- 감정, 판단, 대인관계, 행동 방식이 어떤지
- 어려운 용어를 쓰면 바로 쉬운 말로 다시 풀어 설명하세요

## 지금 중요한 흐름

- 원국 + 대운 + 올해 흐름을 묶어서 설명하세요
- 지금이 안정기인지, 변화기인지, 정리기인지, 확장기인지 분명하게 말하세요
- 현실적으로 어떤 선택을 잘하면 좋은지 연결하세요

## ${categoryLabel}

- 사용자의 질문 카테고리에 맞춰 가장 궁금해할 내용을 중심으로 설명하세요
- 좋은 흐름과 조심할 흐름을 함께 설명하세요
- 추상적인 말보다 실제 생활 장면처럼 설명하세요

## 올해의 포인트

- 올해 전체 분위기
- 상대적으로 좋은 달 2~3개
- 조심하면 좋은 달 2~3개
- 왜 그런지 간단히 설명하세요

## 이렇게 움직이면 좋습니다

반드시 bullet list(-)로 4~6개 작성하세요.
짧고 바로 실천 가능한 조언만 적으세요.

## 마무리

위로와 방향 제시가 함께 느껴지는 한 문단으로 마무리하세요.

문체 조건:
- 한국어 존댓말
- 쉬운 해설체
- 1500~2300자
- 과장 금지
- 무조건 단정하지 말고 가능성과 흐름 중심으로 표현
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
당신은 한국식 명리 상담가입니다.
궁합 결과를 현실적인 관계 해설처럼 쉽게 써주세요.

절대 규칙:
- 반드시 한국어 존댓말로 작성하세요.
- 어려운 용어를 쓰더라도 쉬운 말로 다시 풀어주세요.
- 단정적 예언 금지
- 공포 조장 금지
- 아래 마크다운 형식을 정확히 지키세요

[나]
이름: ${me.name}
일주: ${myAnalysis.saju.day}
핵심: ${myAnalysis.summary.coreMessage}

[상대]
이름: ${other.name}
일주: ${otherAnalysis.saju.day}
핵심: ${otherAnalysis.summary.coreMessage}

[궁합 요약]
점수: ${compatibility.score}
등급: ${compatibility.grade}
장점: ${compatibility.strengths.join(", ")}
주의점: ${compatibility.cautions.join(", ")}
요약: ${compatibility.summary}
근거: ${compatibility.evidence.join(", ")}

반드시 아래 형식으로만 작성하세요.

## 한줄 총평

## 잘 맞는 점

## 부딪히기 쉬운 점

## 관계를 좋게 만드는 방법

- bullet list로 4~5개

## 마무리
`;
}

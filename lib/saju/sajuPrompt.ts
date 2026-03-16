import { UserFortuneInput, SajuAnalysis, CompatibilitySummary } from "./types";

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
      return "직장 적응, 역할 책임, 성과 방식, 대인/평판 이슈 위주로 해석하세요.";
    case "year":
    case "life":
      return "원국과 대운·세운의 큰 흐름을 연결해서 현실적인 방향성 위주로 해석하세요.";
    case "compatibility":
      return "두 사람의 차이와 보완 포인트를 현실적인 관계 운영 관점에서 설명하세요.";
    default:
      return "사용자 질문을 최우선으로 두고 원국/대운/세운/월운을 현실 문제와 연결해 설명하세요.";
  }
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

  return `
오늘 날짜: ${today}

당신은 한국식 사주 해석을 바탕으로 현실적인 조언을 제공하는 상담가입니다.
과장된 예언, 단정적 사고·질병·사망 예측, 공포 조장은 금지합니다.
반드시 제공된 계산 결과를 기반으로만 해석하세요.
${categoryGuide(user.category)}

[사용자 정보]
이름: ${user.name}
성별: ${user.gender === "male" ? "남성" : "여성"}
질문 카테고리: ${user.category}
질문: ${user.question}

[핵심 요약]
핵심 메시지: ${summary.coreMessage}
일간: ${summary.dayMaster} (${summary.dayElement})
신강/신약: ${summary.strength}
균형도: ${summary.balance.level} (격차 ${summary.balance.gap})
강한 오행: ${summary.dominantElements.join(", ")}
약한 오행: ${summary.lackingElements.join(", ")}
용신/희신/기신: ${summary.yongsin} / ${summary.heesin} / ${summary.gisin}
강한 십성: ${summary.dominantTenGods.join(", ")}
약한 십성: ${summary.weakTenGods.join(", ")}
관계 하이라이트: ${summary.relationHighlights.join(" | ") || "특별한 강한 충돌 없음"}
좋은 월: ${summary.goodMonths.map((item) => `${item.month}월(${item.pillar}, ${item.score}점)`).join(", ")}
주의 월: ${summary.cautionMonths.map((item) => `${item.month}월(${item.pillar}, ${item.score}점)`).join(", ")}

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
주요 십성: ${tenGods.dominant.join(", ")}
약한 십성: ${tenGods.weak.join(", ")}
총평: ${tenGods.summary}
세부 분포: ${Object.entries(tenGods.total)
    .map(([key, value]) => `${key} ${value}`)
    .join(", ")}

[대운/세운]
현재 나이: ${daewoon.currentAge}
대운 시작 나이 추정: ${daewoon.startAge}
대운 방향: ${daewoon.direction === "forward" ? "순행" : "역행"}
현재 대운: ${daewoon.daewoon}
올해 세운: ${sewoonDetail.pillar} / ${sewoonDetail.relation} / ${sewoonDetail.score}점
세운 키워드: ${sewoonDetail.keywords.join(", ")}
세운 메모: ${sewoonDetail.note}

[합충형파해]
원국 관계: ${relations.natal.length ? relations.natal.map((item) => `${item.source}-${item.target} ${item.type}`).join(", ") : "특기할 강한 작용 없음"}
세운 관계: ${relations.year.length ? relations.year.map((item) => `${item.source}-${item.target} ${item.type}`).join(", ") : "특기할 강한 작용 없음"}
요약: ${relations.summary}

[월운]
${monthlyFortune
  .map(
    (item) =>
      `${item.month}월 ${item.pillar} ${item.score}점 ${item.keywords.join("/")} - ${item.note}`,
  )
  .join("\n")}

다음 형식으로만 답하세요.

1. 현재 인생 흐름
- 원국, 대운, 세운을 함께 묶어서 설명

2. 사주 구조 핵심
- 일간 성향
- 강약 판단 근거
- 십성 특징
- 합충형파해가 성격과 삶의 패턴에 주는 영향
- 용신/희신을 생활 방식과 연결

3. ${user.category} 운세
- 좋은 흐름과 조심할 흐름을 둘 다 설명
- 추상적 표현보다 현실적인 상황으로 풀어 설명

4. 시기 포인트
- 올해 흐름
- 상대적으로 좋은 월 2~3개
- 조심할 월 2~3개

5. 실천 조언
- 바로 적용 가능한 행동 지침 3~5개

6. 마무리
- 차분하게 한 문단으로 정리

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
당신은 한국식 명리 상담가입니다. 단정적 예언 없이 현실적 궁합 상담을 작성하세요.

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

아래 구조로 900~1400자 분량의 한국어 존댓말 답변을 작성하세요.
1. 관계의 기본 결
2. 잘 맞는 지점
3. 부딪히기 쉬운 지점
4. 오래 가려면 필요한 태도
5. 짧은 마무리
`;
}

import {
  BalanceResult,
  ElementCount,
  ElementKey,
  SajuAnalysis,
  SajuSummary,
  TenGodName,
} from "./types";
import { ELEMENT_LABELS, STEM_ELEMENT_MAP } from "./stemsBranches";

type SajuAnalysisBase = Omit<SajuAnalysis, "summary">;

const TEN_GOD_MEANINGS: Record<TenGodName, string> = {
  비견: "자기주도성과 독립성이 강하게 드러납니다.",
  겁재: "경쟁, 동료, 협업 속 긴장과 추진력이 함께 작동합니다.",
  식신: "생산성, 꾸준함, 결과를 만드는 힘이 살아납니다.",
  상관: "표현력, 창의성, 즉흥성이 강하게 드러납니다.",
  편재: "사업감각, 기회 포착, 외부 활동성이 강해집니다.",
  정재: "안정적 관리, 실속, 재정 감각이 두드러집니다.",
  편관: "압박, 책임, 도전 의식이 강해집니다.",
  정관: "규칙, 직장성, 평판과 책임감이 중요해집니다.",
  편인: "직감, 몰입, 연구 성향이 강하게 작동합니다.",
  정인: "학습, 보호, 이해력, 회복력이 살아납니다.",
};

function getBalance(elements: ElementCount): BalanceResult {
  const values = Object.values(elements);
  const gap = Number((Math.max(...values) - Math.min(...values)).toFixed(2));

  if (gap <= 1.2) return { gap, level: "balanced" };
  if (gap <= 2.4) return { gap, level: "slightly_unbalanced" };
  return { gap, level: "unbalanced" };
}

function sortElements(elements: ElementCount) {
  return (Object.entries(elements) as Array<[ElementKey, number]>).sort(
    (a, b) => b[1] - a[1],
  );
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function buildCoreMessage(
  analysis: SajuAnalysisBase,
  dominantElements: string[],
  lackingElements: string[],
) {
  const primaryTenGod = analysis.tenGods.dominant[0] ?? "비견";
  const relationHint =
    analysis.relations.highlights[0] ?? "관계 변동은 과하지 않은 편";

  return [
    `${analysis.saju.dayStem}일간은 ${
      analysis.strength.strength === "strong"
        ? "기본 체력과 자기축이 비교적 뚜렷한 편"
        : "보강과 회복 환경을 잘 챙길수록 힘이 살아나는 편"
    }입니다.`,
    `오행은 ${dominantElements.join(", ")} 쪽이 상대적으로 강하고 ${lackingElements.join(", ")} 쪽은 보완 포인트입니다.`,
    `십성에서는 ${primaryTenGod} 기운이 눈에 띄며, ${TEN_GOD_MEANINGS[primaryTenGod]}`,
    `현재는 ${analysis.daewoon.daewoon} 대운과 ${analysis.sewoonDetail.pillar} 세운이 겹치며 ${analysis.sewoonDetail.relation}으로 읽히고, ${relationHint} 흐름을 함께 봐야 합니다.`,
  ].join(" ");
}

export function buildSajuSummary(analysis: SajuAnalysisBase): SajuSummary {
  const sortedElements = sortElements(analysis.elements);
  const dominantElements = unique(
    sortedElements.slice(0, 2).map(([key]) => ELEMENT_LABELS[key]),
  );
  const lackingElements = unique(
    sortedElements.slice(-2).map(([key]) => ELEMENT_LABELS[key]),
  );

  const balance = getBalance(analysis.elements);
  const dayElement = ELEMENT_LABELS[STEM_ELEMENT_MAP[analysis.saju.dayStem]];

  const goodMonths = [...analysis.monthlyFortune]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ month, pillar, score }) => ({ month, pillar, score }));

  const cautionMonths = [...analysis.monthlyFortune]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(({ month, pillar, score }) => ({ month, pillar, score }));

  return {
    dayMaster: analysis.saju.dayStem,
    dayElement,
    strength: analysis.strength.strength,
    strengthScore: analysis.strength.score,
    balance,
    dominantElements,
    lackingElements,
    yongsin: analysis.yongsin.yongsin,
    heesin: analysis.yongsin.heesin,
    gisin: analysis.yongsin.gisin,
    dominantTenGods: analysis.tenGods.dominant,
    weakTenGods: analysis.tenGods.weak,
    relationHighlights: analysis.relations.highlights,
    currentDaewoon: analysis.daewoon.daewoon,
    currentSeWoon: analysis.sewoonDetail.pillar,
    currentSeWoonRelation: analysis.sewoonDetail.relation,
    goodMonths,
    cautionMonths,
    coreMessage: buildCoreMessage(analysis, dominantElements, lackingElements),
  };
}

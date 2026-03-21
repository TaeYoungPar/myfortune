import { Solar } from "./lunar";
import { SajuPillars, SeWoonDetail, TenGodName } from "./types";
import {
  BRANCH_ELEMENT_MAP,
  ELEMENT_LABELS,
  STEM_ELEMENT_MAP,
  TEN_GOD_LABELS,
  getControlledElement,
  getControllingElement,
  getGeneratedElement,
  getGeneratingElement,
  getTenGod,
} from "./stemsBranches";

const SIX_HAP: Record<string, string> = {
  자축: "합",
  인해: "합",
  묘술: "합",
  진유: "합",
  사신: "합",
  오미: "합",
};

const SIX_CHUNG: Record<string, string> = {
  자오: "충",
  축미: "충",
  인신: "충",
  묘유: "충",
  진술: "충",
  사해: "충",
};

function key(a: string, b: string) {
  return [a, b].sort().join("");
}

function getStemFlowScore(
  dayElement: keyof typeof ELEMENT_LABELS,
  yearStemElement: keyof typeof ELEMENT_LABELS,
) {
  const resourceElement = getGeneratingElement(dayElement);
  const outputElement = getGeneratedElement(dayElement);
  const wealthElement = getControlledElement(dayElement);
  const powerElement = getControllingElement(dayElement);

  if (yearStemElement === dayElement) {
    return {
      relation: "자기 강화 흐름",
      score: 12,
      keywords: ["자기주도", "확장", "독립성"],
      note: "연간이 일간과 같은 오행이라 자기색과 주도성이 강해지기 쉽습니다.",
    };
  }

  if (yearStemElement === resourceElement) {
    return {
      relation: "보강 흐름",
      score: 15,
      keywords: ["회복", "학습", "지원"],
      note: "연간이 인성 방향으로 작용해 회복, 학습, 보호막 형성이 유리합니다.",
    };
  }

  if (yearStemElement === outputElement) {
    return {
      relation: "표출 흐름",
      score: 7,
      keywords: ["표현", "성과", "실행"],
      note: "연간이 식상 방향으로 흐르며 말·표현·실행력이 커질 수 있습니다.",
    };
  }

  if (yearStemElement === wealthElement) {
    return {
      relation: "재성 흐름",
      score: 5,
      keywords: ["재물", "현실", "관리"],
      note: "연간이 재성 방향으로 작용해 돈, 관계, 현실 과제가 커질 수 있습니다.",
    };
  }

  if (yearStemElement === powerElement) {
    return {
      relation: "압박 흐름",
      score: -10,
      keywords: ["책임", "평가", "긴장"],
      note: "연간이 관성 방향으로 들어와 책임과 압박, 평가 이슈가 커질 수 있습니다.",
    };
  }

  return {
    relation: "중립 흐름",
    score: 0,
    keywords: ["유지", "정리", "균형"],
    note: "큰 추동력보다 유지·정리 성격이 강한 흐름입니다.",
  };
}

function getBranchInteraction(natalBranches: string[], yearBranch: string) {
  const evidence: string[] = [];
  let score = 0;

  for (const natal of natalBranches) {
    const pairKey = key(natal, yearBranch);

    if (SIX_HAP[pairKey]) {
      score += 6;
      evidence.push(
        `${natal}-${yearBranch} 지지 합이 있어 관계·환경 연결이 부드럽게 붙는 편입니다.`,
      );
    }

    if (SIX_CHUNG[pairKey]) {
      score -= 10;
      evidence.push(
        `${natal}-${yearBranch} 지지 충이 있어 이동, 충돌, 일정 변동성이 커질 수 있습니다.`,
      );
    }
  }

  return { score, evidence };
}

function getAnnualTenGod(dayStem: string, yearStem: string): TenGodName {
  return getTenGod(dayStem, yearStem);
}

export function calculateSeWoonDetail(saju?: SajuPillars): SeWoonDetail {
  const now = new Date();
  const solar = Solar.fromYmd(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );
  const lunar = solar.getLunar();
  const pillar = lunar.getYearInGanZhi();

  const stem = pillar[0];
  const branch = pillar[1];
  const stemElement = STEM_ELEMENT_MAP[stem];
  const branchElement = BRANCH_ELEMENT_MAP[branch];

  let score = 62;
  let relation = "중립 흐름";
  let keywords = ["유지", "정리", "균형"];
  let note = `${ELEMENT_LABELS[stemElement]} 기운의 천간과 ${ELEMENT_LABELS[branchElement]} 기운의 지지가 함께 작용합니다.`;
  let evidence: string[] = [
    `세운은 ${now.getFullYear()}년 ${pillar}년 기준으로 읽었습니다.`,
  ];

  if (saju) {
    const dayElement = STEM_ELEMENT_MAP[saju.dayStem];
    const stemFlow = getStemFlowScore(dayElement, stemElement);
    const annualTenGod = getAnnualTenGod(saju.dayStem, stem);
    const branchInteraction = getBranchInteraction(
      [saju.yearBranch, saju.monthBranch, saju.dayBranch, saju.hourBranch],
      branch,
    );

    score = 62 + stemFlow.score + branchInteraction.score;
    score = Math.max(35, Math.min(92, score));

    relation = stemFlow.relation;
    keywords = stemFlow.keywords;
    note = `${stemFlow.note} 연간 십성은 ${TEN_GOD_LABELS[annualTenGod]}에 해당하며, 지지 쪽에서는 출생 명식과의 합충을 함께 봐야 합니다.`;

    evidence = [
      `연간 ${stem}은 일간 ${saju.dayStem} 기준 ${TEN_GOD_LABELS[annualTenGod]}로 작용합니다.`,
      stemFlow.note,
      ...branchInteraction.evidence,
    ];

    if (!branchInteraction.evidence.length) {
      evidence.push(
        "지지 쪽에서 강한 합충 신호는 크지 않아, 올해는 천간 흐름의 체감이 상대적으로 더 큰 편입니다.",
      );
    }
  }

  return {
    year: now.getFullYear(),
    pillar,
    stem,
    branch,
    stemElement: ELEMENT_LABELS[stemElement],
    branchElement: ELEMENT_LABELS[branchElement],
    relation,
    score,
    keywords,
    note,
    evidence,
  };
}

export function calculateSeWoon(saju?: SajuPillars): string {
  const detail = calculateSeWoonDetail(saju);
  const because = detail.evidence[0] ? ` 근거는 ${detail.evidence[0]}` : "";

  return `${detail.year}년 ${detail.pillar}년입니다. 연간 ${detail.stem}(${detail.stemElement}), 연지 ${detail.branch}(${detail.branchElement})가 들어오며 ${detail.relation}으로 해석합니다. 체감 점수는 ${detail.score}점 수준이며 키워드는 ${detail.keywords.join(", ")}입니다. ${detail.note}${because}`;
}

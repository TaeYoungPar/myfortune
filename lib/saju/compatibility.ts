import { CompatibilitySummary, SajuAnalysis } from "./types";
import { ELEMENT_LABELS, STEM_ELEMENT_MAP } from "./stemsBranches";

const DAY_STEM_PAIR_SCORE: Record<string, number> = {
  갑갑: 70,
  갑을: 74,
  갑병: 86,
  갑정: 78,
  갑무: 72,
  갑기: 68,
  갑경: 61,
  갑신: 64,
  갑임: 82,
  갑계: 76,
  을을: 72,
  을병: 76,
  을정: 84,
  을무: 66,
  을기: 74,
  을경: 63,
  을신: 67,
  을임: 74,
  을계: 82,
  병병: 70,
  병정: 74,
  병무: 84,
  병기: 76,
  병경: 68,
  병신: 64,
  병임: 60,
  병계: 62,
  정정: 72,
  정무: 76,
  정기: 84,
  정경: 66,
  정신: 70,
  정임: 64,
  정계: 60,
  무무: 70,
  무기: 74,
  무경: 84,
  무신: 76,
  무임: 68,
  무계: 64,
  기기: 72,
  기경: 76,
  기신: 84,
  기임: 66,
  기계: 70,
  경경: 70,
  경신: 74,
  경임: 84,
  경계: 76,
  신신: 72,
  신임: 76,
  신계: 84,
  임임: 70,
  임계: 74,
  계계: 72,
};

const SIX_HAP: Record<string, number> = {
  자축: 12,
  인해: 12,
  묘술: 12,
  진유: 12,
  사신: 12,
  오미: 12,
};

const SIX_CHUNG: Record<string, number> = {
  자오: -14,
  축미: -14,
  인신: -14,
  묘유: -14,
  진술: -14,
  사해: -14,
};

function key(a: string, b: string) {
  return [a, b].sort().join("");
}

function grade(score: number): CompatibilitySummary["grade"] {
  if (score >= 85) return "A";
  if (score >= 72) return "B";
  if (score >= 58) return "C";
  return "D";
}

function dominantElement(analysis: SajuAnalysis) {
  return Object.entries(analysis.elements).sort((a, b) => b[1] - a[1])[0][0];
}

function isYongsinMatch(base: SajuAnalysis, partner: SajuAnalysis) {
  const partnerDayElement =
    ELEMENT_LABELS[STEM_ELEMENT_MAP[partner.saju.dayStem]];
  return (
    base.yongsin.yongsin === partnerDayElement ||
    base.yongsin.heesin === partnerDayElement ||
    partner.yongsin.yongsin ===
      ELEMENT_LABELS[STEM_ELEMENT_MAP[base.saju.dayStem]] ||
    partner.yongsin.heesin ===
      ELEMENT_LABELS[STEM_ELEMENT_MAP[base.saju.dayStem]]
  );
}

function strengthComplement(a: SajuAnalysis, b: SajuAnalysis) {
  return a.strength.strength !== b.strength.strength;
}

export function analyzeCompatibility(
  a: SajuAnalysis,
  b: SajuAnalysis,
): CompatibilitySummary {
  let score = 55;
  const strengths: string[] = [];
  const cautions: string[] = [];
  const evidence: string[] = [];

  const dayKey = key(a.saju.dayStem, b.saju.dayStem);
  const dayStemBase = DAY_STEM_PAIR_SCORE[dayKey];
  if (dayStemBase) {
    const adjusted = Math.round((dayStemBase - 70) / 2);
    score += adjusted;
    evidence.push(
      `일간 조합(${a.saju.dayStem}-${b.saju.dayStem}) 기본 궁합 점수를 반영했습니다.`,
    );
  }

  const dayBranchKey = key(a.saju.dayBranch, b.saju.dayBranch);
  const dayBranchScore = SIX_HAP[dayBranchKey] ?? SIX_CHUNG[dayBranchKey] ?? 0;
  score += dayBranchScore;

  if (dayBranchScore > 0) {
    strengths.push(
      "일지 합이 있어 생활 리듬과 정서 접점이 비교적 자연스럽게 이어질 수 있습니다.",
    );
    evidence.push(
      `일지 ${a.saju.dayBranch}-${b.saju.dayBranch} 합을 긍정 신호로 반영했습니다.`,
    );
  } else if (dayBranchScore < 0) {
    cautions.push(
      "일지 충이 있어 가까워질수록 생활 습관, 거리감, 감정 반응 차이를 조율해야 합니다.",
    );
    evidence.push(
      `일지 ${a.saju.dayBranch}-${b.saju.dayBranch} 충을 주의 신호로 반영했습니다.`,
    );
  }

  const aDominant = dominantElement(a);
  const bDominant = dominantElement(b);
  if (aDominant !== bDominant) {
    score += 6;
    strengths.push(
      `오행 주력 포인트가 ${ELEMENT_LABELS[aDominant as keyof typeof ELEMENT_LABELS]} / ${ELEMENT_LABELS[bDominant as keyof typeof ELEMENT_LABELS]}로 갈려 상호 보완성이 있습니다.`,
    );
    evidence.push("서로 강하게 쓰는 오행이 달라 보완 점수를 더했습니다.");
  } else {
    cautions.push(
      "강하게 쓰는 에너지가 비슷해 장점도 겹치지만 피로 지점도 겹칠 수 있습니다.",
    );
  }

  if (isYongsinMatch(a, b) || isYongsinMatch(b, a)) {
    score += 8;
    strengths.push(
      "한쪽의 필요한 기운을 상대가 어느 정도 보완해주는 구조가 보여 관계 체감이 좋아질 수 있습니다.",
    );
    evidence.push("용신/희신 보완 가능성을 가산했습니다.");
  }

  if (strengthComplement(a, b)) {
    score += 5;
    strengths.push(
      "신강·신약 패턴이 달라 한쪽이 밀고 한쪽이 완충하는 식의 보완이 가능합니다.",
    );
    evidence.push("신강/신약 보완 구조를 반영했습니다.");
  } else {
    cautions.push(
      "둘 다 비슷한 강도로 버티는 타입이라 갈등 시 양보 타이밍이 늦어질 수 있습니다.",
    );
  }

  if (
    a.summary.balance.level === "balanced" ||
    b.summary.balance.level === "balanced"
  ) {
    score += 4;
    strengths.push(
      "한쪽 또는 양쪽의 균형감이 좋아 관계가 흔들릴 때 중심을 잡아주기 쉽습니다.",
    );
  }

  if (
    a.summary.currentSeWoonRelation === "압박 흐름" ||
    b.summary.currentSeWoonRelation === "압박 흐름"
  ) {
    score -= 4;
    cautions.push(
      "현재 운에서는 한쪽이 예민하거나 책임 부담이 커질 수 있어 감정 소모 관리가 중요합니다.",
    );
    evidence.push("현재 세운 압박 흐름을 감점 요소로 반영했습니다.");
  }

  score = Math.max(35, Math.min(95, score));
  const resultGrade = grade(score);

  if (!strengths.length) {
    strengths.push(
      "기본 궁합은 무난하며, 대화 습관과 생활 리듬 조율이 핵심입니다.",
    );
  }

  if (!cautions.length) {
    cautions.push(
      "큰 충돌 신호는 강하지 않지만 기대치와 속도 차이는 미리 맞추는 편이 좋습니다.",
    );
  }

  return {
    score,
    grade: resultGrade,
    strengths: strengths.slice(0, 3),
    cautions: cautions.slice(0, 3),
    evidence: evidence.slice(0, 5),
    summary: `궁합 점수는 ${score}점(${resultGrade}등급)입니다. 핵심 장점은 ${strengths[0]} 핵심 주의점은 ${cautions[0]}`,
  };
}

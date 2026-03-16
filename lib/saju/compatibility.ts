import { SajuAnalysis, CompatibilitySummary } from "./types";
import { ELEMENT_LABELS } from "./stemsBranches";

const DAY_STEM_PAIR_SCORE: Record<string, number> = {
  갑갑: 70, 갑을: 74, 갑병: 86, 갑정: 78, 갑무: 72, 갑기: 68, 갑경: 61, 갑신: 64, 갑임: 82, 갑계: 76,
  을을: 72, 을병: 76, 을정: 84, 을무: 66, 을기: 74, 을경: 63, 을신: 67, 을임: 74, 을계: 82,
  병병: 70, 병정: 74, 병무: 84, 병기: 76, 병경: 68, 병신: 64, 병임: 60, 병계: 62,
  정정: 72, 정무: 76, 정기: 84, 정경: 66, 정신: 70, 정임: 64, 정계: 60,
  무무: 70, 무기: 74, 무경: 84, 무신: 76, 무임: 68, 무계: 64,
  기기: 72, 기경: 76, 기신: 84, 기임: 66, 기계: 70,
  경경: 70, 경신: 74, 경임: 84, 경계: 76,
  신신: 72, 신임: 76, 신계: 84,
  임임: 70, 임계: 74,
  계계: 72,
};

const BRANCH_HARMONY: Record<string, number> = {
  자축: 12, 인해: 12, 묘술: 12, 진유: 12, 사신: 12, 오미: 12,
  자오: -12, 축미: -12, 인신: -12, 묘유: -12, 진술: -12, 사해: -12,
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

export function analyzeCompatibility(a: SajuAnalysis, b: SajuAnalysis): CompatibilitySummary {
  let score = 55;
  const strengths: string[] = [];
  const cautions: string[] = [];

  const dayKey = key(a.saju.dayStem, b.saju.dayStem);
  score += DAY_STEM_PAIR_SCORE[dayKey] ? Math.round((DAY_STEM_PAIR_SCORE[dayKey] - 70) / 2) : 0;

  const dayBranchKey = key(a.saju.dayBranch, b.saju.dayBranch);
  const dayBranchScore = BRANCH_HARMONY[dayBranchKey] ?? 0;
  score += dayBranchScore;

  if (dayBranchScore > 0) {
    strengths.push("일지 흐름이 부드럽게 이어져 생활 리듬을 맞추기 쉬운 편입니다.");
  } else if (dayBranchScore < 0) {
    cautions.push("일지 충돌이 있어 가까워질수록 생활 방식 차이를 조율해야 합니다.");
  }

  const aDominant = dominantElement(a);
  const bDominant = dominantElement(b);
  if (aDominant !== bDominant) {
    score += 6;
    strengths.push(`오행 주력 포인트가 ${ELEMENT_LABELS[aDominant as keyof typeof ELEMENT_LABELS]} / ${ELEMENT_LABELS[bDominant as keyof typeof ELEMENT_LABELS]}로 갈려 상호 보완성이 있습니다.`);
  } else {
    cautions.push("서로 강하게 쓰는 에너지가 비슷해 장점도 겹치지만 피로 포인트도 겹칠 수 있습니다.");
  }

  if (a.summary.balance.level === "balanced" || b.summary.balance.level === "balanced") {
    score += 4;
    strengths.push("한쪽 또는 양쪽의 균형감이 좋아 관계가 흔들릴 때 중심을 잡아주기 쉽습니다.");
  }

  if (a.summary.currentSeWoonRelation === "압박 흐름" || b.summary.currentSeWoonRelation === "압박 흐름") {
    cautions.push("현재 운에서는 한쪽이 예민하거나 책임 부담이 커질 수 있어 감정 소모 관리가 중요합니다.");
  }

  score = Math.max(35, Math.min(95, score));
  const resultGrade = grade(score);

  if (!strengths.length) strengths.push("기본 궁합은 무난하며, 대화 습관과 생활 리듬 조율이 핵심입니다.");
  if (!cautions.length) cautions.push("큰 충돌 신호는 강하지 않지만 기대치와 속도 차이는 미리 맞추는 편이 좋습니다.");

  return {
    score,
    grade: resultGrade,
    strengths: strengths.slice(0, 3),
    cautions: cautions.slice(0, 3),
    summary: `궁합 점수는 ${score}점(${resultGrade}등급)입니다. 장점은 ${strengths[0]} 주의점은 ${cautions[0]}`,
  };
}

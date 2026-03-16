import { Solar } from "./lunar";
import { SajuPillars, SeWoonDetail } from "./types";
import {
  BRANCH_ELEMENT_MAP,
  ELEMENT_LABELS,
  STEM_ELEMENT_MAP,
  getControlledElement,
  getControllingElement,
  getGeneratedElement,
  getGeneratingElement,
} from "./stemsBranches";

export function calculateSeWoonDetail(saju?: SajuPillars): SeWoonDetail {
  const now = new Date();
  const solar = Solar.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const lunar = solar.getLunar();
  const pillar = lunar.getYearInGanZhi();

  const stem = pillar[0];
  const branch = pillar[1];
  const stemElement = STEM_ELEMENT_MAP[stem];
  const branchElement = BRANCH_ELEMENT_MAP[branch];

  let relation = "중립 흐름";
  let score = 62;
  let keywords = ["유지", "정리", "균형"];
  let note = `${ELEMENT_LABELS[stemElement]}와 ${ELEMENT_LABELS[branchElement]} 기운이 함께 작용합니다.`;

  if (saju) {
    const dayElement = STEM_ELEMENT_MAP[saju.dayStem];
    const resourceElement = getGeneratingElement(dayElement);
    const outputElement = getGeneratedElement(dayElement);
    const wealthElement = getControlledElement(dayElement);
    const powerElement = getControllingElement(dayElement);

    if (stemElement === dayElement || stemElement === resourceElement) {
      relation = "보강 흐름";
      score = 82;
      keywords = ["회복", "학습", "정비"];
      note = "회복, 학습, 재정비에 힘이 실리기 쉬운 해입니다.";
    } else if (stemElement === outputElement || stemElement === wealthElement) {
      relation = "활동 흐름";
      score = 74;
      keywords = ["실행", "성과", "대외활동"];
      note = "성과, 실행, 대외 활동이 늘어날 수 있어 결과 관리가 중요합니다.";
    } else if (stemElement === powerElement) {
      relation = "압박 흐름";
      score = 54;
      keywords = ["책임", "평가", "페이스조절"];
      note = "책임, 규정, 평가 압력이 커질 수 있어 페이스 조절이 중요합니다.";
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
  };
}

export function calculateSeWoon(saju?: SajuPillars): string {
  const detail = calculateSeWoonDetail(saju);
  return `${detail.year}년 ${detail.pillar}년. 연간 ${detail.stem}(${detail.stemElement}), 연지 ${detail.branch}(${detail.branchElement})가 들어오며 ${detail.relation}으로 해석합니다. 체감 점수는 ${detail.score}점 수준이며 키워드는 ${detail.keywords.join(", ")}입니다. ${detail.note}`;
}

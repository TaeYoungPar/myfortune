import { ElementBreakdown, ElementCount, SajuPillars } from "./types";
import {
  BRANCH_ELEMENT_MAP,
  HIDDEN_STEMS_MAP,
  STEM_ELEMENT_MAP,
  createEmptyElements,
  roundElementCount,
} from "./stemsBranches";

const STEM_WEIGHT = 1;
const BRANCH_WEIGHT = 0.8;
const HIDDEN_STEM_BASE_WEIGHT = 0.6;

function add(target: ElementCount, key: keyof ElementCount, amount: number) {
  target[key] += amount;
}

export function calculateElementsWithBreakdown(saju: SajuPillars): ElementBreakdown {
  const stemCounts = createEmptyElements();
  const branchCounts = createEmptyElements();
  const hiddenStemCounts = createEmptyElements();

  const stemList = [saju.yearStem, saju.monthStem, saju.dayStem, saju.hourStem];
  const branchList = [saju.yearBranch, saju.monthBranch, saju.dayBranch, saju.hourBranch];

  stemList.forEach((stem) => {
    const element = STEM_ELEMENT_MAP[stem];
    if (element) add(stemCounts, element, STEM_WEIGHT);
  });

  branchList.forEach((branch) => {
    const element = BRANCH_ELEMENT_MAP[branch];
    if (element) add(branchCounts, element, BRANCH_WEIGHT);

    (HIDDEN_STEMS_MAP[branch] ?? []).forEach(({ stem, weight }) => {
      const hiddenElement = STEM_ELEMENT_MAP[stem];
      if (hiddenElement) add(hiddenStemCounts, hiddenElement, HIDDEN_STEM_BASE_WEIGHT * weight);
    });
  });

  const total = createEmptyElements();
  (Object.keys(total) as Array<keyof ElementCount>).forEach((key) => {
    total[key] = stemCounts[key] + branchCounts[key] + hiddenStemCounts[key];
  });

  return {
    stems: roundElementCount(stemCounts),
    branches: roundElementCount(branchCounts),
    hiddenStems: roundElementCount(hiddenStemCounts),
    total: roundElementCount(total),
  };
}

export function calculateElements(saju: SajuPillars): ElementCount {
  return calculateElementsWithBreakdown(saju).total;
}

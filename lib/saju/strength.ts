import { ElementCount, SajuPillars, StrengthResult } from "./types";
import {
  BRANCH_ELEMENT_MAP,
  HIDDEN_STEMS_MAP,
  STEM_ELEMENT_MAP,
  getControlledElement,
  getControllingElement,
  getElementLabel,
  getGeneratedElement,
  getGeneratingElement,
} from "./stemsBranches";

function getMonthSeasonSupport(
  monthBranch: string,
  dayElement: keyof ElementCount,
): number {
  const monthElement = BRANCH_ELEMENT_MAP[monthBranch];

  if (!monthElement) return 0;
  if (monthElement === dayElement) return 2.4;
  if (getGeneratingElement(dayElement) === monthElement) return 1.6;
  if (getGeneratedElement(dayElement) === monthElement) return -0.9;
  if (getControlledElement(dayElement) === monthElement) return -1.1;
  if (getControllingElement(dayElement) === monthElement) return -1.3;
  return -0.6;
}

function countRoots(saju: SajuPillars, dayElement: keyof ElementCount): number {
  const resourceElement = getGeneratingElement(dayElement);
  const targetBranches = [
    saju.yearBranch,
    saju.monthBranch,
    saju.dayBranch,
    saju.hourBranch,
  ];

  let roots = 0;

  targetBranches.forEach((branch) => {
    const branchElement = BRANCH_ELEMENT_MAP[branch];
    const hiddenStems = HIDDEN_STEMS_MAP[branch] ?? [];

    const hasRootByBranch =
      branchElement === dayElement || branchElement === resourceElement;

    const hasRootByHiddenStem = hiddenStems.some(({ stem }) => {
      const hiddenElement = STEM_ELEMENT_MAP[stem];
      return hiddenElement === dayElement || hiddenElement === resourceElement;
    });

    if (hasRootByBranch || hasRootByHiddenStem) {
      roots += 1;
    }
  });

  return roots;
}

export function calculateStrength(
  saju: SajuPillars,
  elements: ElementCount,
): StrengthResult {
  const dayElement = STEM_ELEMENT_MAP[saju.dayStem];
  const resourceElement = getGeneratingElement(dayElement);
  const outputElement = getGeneratedElement(dayElement);
  const wealthElement = getControlledElement(dayElement);
  const powerElement = getControllingElement(dayElement);

  const seasonSupport = getMonthSeasonSupport(saju.monthBranch, dayElement);
  const rootCount = countRoots(saju, dayElement);

  const supportScore =
    elements[dayElement] * 1.3 +
    elements[resourceElement] * 1.15 +
    rootCount * 0.75 +
    seasonSupport;

  const drainScore =
    elements[outputElement] * 0.7 +
    elements[wealthElement] * 0.65 +
    elements[powerElement] * 0.8;

  const score = Number((supportScore - drainScore).toFixed(2));
  const strength = score >= 2.3 ? "strong" : "weak";

  const favorableElements =
    strength === "strong"
      ? [outputElement, wealthElement, powerElement].map(getElementLabel)
      : [resourceElement, dayElement].map(getElementLabel);

  const unfavorableElements =
    strength === "strong"
      ? [dayElement, resourceElement].map(getElementLabel)
      : [powerElement, wealthElement, outputElement].map(getElementLabel);

  const summary =
    strength === "strong"
      ? `일간 ${getElementLabel(dayElement)}의 뿌리와 계절 힘이 살아 있어 신강 쪽으로 판단합니다.`
      : `일간 ${getElementLabel(dayElement)}를 돕는 계절력과 통근이 상대적으로 약해 신약 쪽으로 판단합니다.`;

  return {
    dayElement,
    strength,
    score,
    seasonSupport: Number(seasonSupport.toFixed(2)),
    rootCount,
    favorableElements,
    unfavorableElements,
    summary,
  };
}

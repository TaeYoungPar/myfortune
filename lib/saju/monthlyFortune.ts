import { Solar } from "./lunar";
import { ElementCount, ElementKey, MonthlyFortune, StrengthResult } from "./types";
import {
  BRANCH_ELEMENT_MAP,
  STEM_ELEMENT_MAP,
  getControlledElement,
  getControllingElement,
  getGeneratedElement,
  getGeneratingElement,
} from "./stemsBranches";

function relationScore(dayElement: ElementKey, monthElement: ElementKey) {
  if (monthElement === dayElement) return 8;
  if (monthElement === getGeneratingElement(dayElement)) return 9;
  if (monthElement === getGeneratedElement(dayElement)) return 6;
  if (monthElement === getControlledElement(dayElement)) return 5;
  if (monthElement === getControllingElement(dayElement)) return 4;
  return 5;
}

function keywords(dayElement: ElementKey, monthElement: ElementKey): string[] {
  if (monthElement === getGeneratingElement(dayElement)) return ["회복", "도움", "정리"];
  if (monthElement === dayElement) return ["자기주도", "확장", "집중"];
  if (monthElement === getGeneratedElement(dayElement)) return ["표현", "성과", "소진관리"];
  if (monthElement === getControlledElement(dayElement)) return ["재정", "실속", "결과"];
  return ["압박", "규칙", "페이스조절"];
}

function getMonthPillar(year: number, month: number) {
  const solar = Solar.fromYmdHms(year, month, 15, 12, 0, 0);
  const eightChar = solar.getLunar().getEightChar();
  return {
    stem: eightChar.getMonthGan(),
    branch: eightChar.getMonthZhi(),
  };
}

export function calculateMonthlyFortune(
  elements: ElementCount,
  strength: StrengthResult,
  targetYear = new Date().getFullYear(),
): MonthlyFortune[] {
  const total = elements.wood + elements.fire + elements.earth + elements.metal + elements.water;

  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const { stem, branch } = getMonthPillar(targetYear, month);
    const stemElement = STEM_ELEMENT_MAP[stem];
    const monthElement = BRANCH_ELEMENT_MAP[branch];

    const base = relationScore(strength.dayElement, monthElement);
    const balanceBonus = total > 0 ? (10 - Math.abs(elements[strength.dayElement] - total / 5)) * 1.2 : 0;
    const seasonalBonus = stemElement === strength.dayElement || stemElement === getGeneratingElement(strength.dayElement) ? 5 : 0;
    const strengthTuning =
      strength.strength === "weak"
        ? stemElement === getGeneratingElement(strength.dayElement) || stemElement === strength.dayElement
          ? 5
          : -2
        : stemElement === getGeneratedElement(strength.dayElement) || stemElement === getControlledElement(strength.dayElement)
          ? 4
          : 0;

    const score = Math.max(35, Math.min(95, Math.round(base * 6 + balanceBonus + seasonalBonus + strengthTuning)));
    const favorable = score >= 68;
    const monthKeywords = keywords(strength.dayElement, monthElement);
    const note = favorable
      ? "추진과 정리가 비교적 잘 맞물리는 달입니다."
      : score <= 54
        ? "무리한 확장보다 속도 조절과 일정 정비가 중요한 달입니다."
        : "무난하지만 선택과 집중이 필요한 달입니다.";

    return {
      month,
      pillar: `${stem}${branch}`,
      score,
      favorable,
      keywords: monthKeywords,
      note,
    };
  });
}

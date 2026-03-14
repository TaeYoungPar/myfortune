import { ElementCount, ElementKey, MonthlyFortune } from "./types";
import {
  BRANCH_ELEMENT_MAP,
  branches,
  getControlledElement,
  getControllingElement,
  getGeneratedElement,
  getGeneratingElement,
} from "./stemsBranches";

const MONTH_BRANCHES = ["인", "묘", "진", "사", "오", "미", "신", "유", "술", "해", "자", "축"] as const;

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

function monthStemByIndex(index: number): string {
  return stemsForCalendar[(index % stemsForCalendar.length + stemsForCalendar.length) % stemsForCalendar.length];
}

const stemsForCalendar = ["병", "정", "무", "기", "경", "신", "임", "계", "갑", "을"] as const;

export function calculateMonthlyFortune(
  elements: ElementCount,
  dayElement: ElementKey,
): MonthlyFortune[] {
  const total = elements.wood + elements.fire + elements.earth + elements.metal + elements.water;

  return MONTH_BRANCHES.map((branch, index) => {
    const monthElement = BRANCH_ELEMENT_MAP[branch];
    const base = relationScore(dayElement, monthElement);
    const balanceBonus = total > 0 ? (10 - Math.abs(elements[dayElement] - total / 5)) * 1.2 : 0;
    const score = Math.max(35, Math.min(95, Math.round(base * 6 + balanceBonus)));

    return {
      month: index + 1,
      pillar: `${monthStemByIndex(index)}${branch}`,
      score,
      keywords: keywords(dayElement, monthElement),
    };
  });
}

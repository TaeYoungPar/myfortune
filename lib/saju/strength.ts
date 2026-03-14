import { ElementCount, SajuPillars } from "./types";

const stemElement: Record<string, keyof ElementCount> = {
  갑: "wood",
  을: "wood",
  병: "fire",
  정: "fire",
  무: "earth",
  기: "earth",
  경: "metal",
  신: "metal",
  임: "water",
  계: "water",
};

export type StrengthResult = {
  dayElement: keyof ElementCount;
  strength: "strong" | "weak";
};

export function calculateStrength(
  saju: SajuPillars,
  elements: ElementCount,
): StrengthResult {
  const dayStem = saju.dayStem;

  const dayElement = stemElement[dayStem];

  const same = elements[dayElement];

  const total =
    elements.wood +
    elements.fire +
    elements.earth +
    elements.metal +
    elements.water;

  const ratio = same / total;

  const strength = ratio >= 0.35 ? "strong" : "weak";

  return {
    dayElement,
    strength,
  };
}

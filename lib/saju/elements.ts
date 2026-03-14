import { ElementCount, SajuPillars } from "./types";

const elementMap: Record<string, keyof ElementCount> = {
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

export function calculateElements(saju: SajuPillars): ElementCount {
  const elements: ElementCount = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  const stems = [saju.yearStem, saju.monthStem, saju.dayStem, saju.hourStem];

  stems.forEach((stem) => {
    const element = elementMap[stem];
    if (element) elements[element]++;
  });

  return elements;
}

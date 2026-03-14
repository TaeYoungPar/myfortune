import { ElementCount, ElementKey, TenGodCount, TenGodName } from "./types";

export const stems = [
  "갑",
  "을",
  "병",
  "정",
  "무",
  "기",
  "경",
  "신",
  "임",
  "계",
] as const;

export const branches = [
  "자",
  "축",
  "인",
  "묘",
  "진",
  "사",
  "오",
  "미",
  "신",
  "유",
  "술",
  "해",
] as const;

export const ELEMENT_LABELS: Record<ElementKey, string> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

export const STEM_ELEMENT_MAP: Record<string, ElementKey> = {
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

export const STEM_YIN_YANG_MAP: Record<string, "yang" | "yin"> = {
  갑: "yang",
  을: "yin",
  병: "yang",
  정: "yin",
  무: "yang",
  기: "yin",
  경: "yang",
  신: "yin",
  임: "yang",
  계: "yin",
};

export const BRANCH_ELEMENT_MAP: Record<string, ElementKey> = {
  자: "water",
  축: "earth",
  인: "wood",
  묘: "wood",
  진: "earth",
  사: "fire",
  오: "fire",
  미: "earth",
  신: "metal",
  유: "metal",
  술: "earth",
  해: "water",
};

export const HIDDEN_STEMS_MAP: Record<string, Array<{ stem: string; weight: number }>> = {
  자: [{ stem: "계", weight: 1 }],
  축: [
    { stem: "기", weight: 0.6 },
    { stem: "계", weight: 0.25 },
    { stem: "신", weight: 0.15 },
  ],
  인: [
    { stem: "갑", weight: 0.6 },
    { stem: "병", weight: 0.25 },
    { stem: "무", weight: 0.15 },
  ],
  묘: [{ stem: "을", weight: 1 }],
  진: [
    { stem: "무", weight: 0.6 },
    { stem: "을", weight: 0.25 },
    { stem: "계", weight: 0.15 },
  ],
  사: [
    { stem: "병", weight: 0.6 },
    { stem: "무", weight: 0.25 },
    { stem: "경", weight: 0.15 },
  ],
  오: [
    { stem: "정", weight: 0.7 },
    { stem: "기", weight: 0.3 },
  ],
  미: [
    { stem: "기", weight: 0.6 },
    { stem: "정", weight: 0.25 },
    { stem: "을", weight: 0.15 },
  ],
  신: [
    { stem: "경", weight: 0.6 },
    { stem: "임", weight: 0.25 },
    { stem: "무", weight: 0.15 },
  ],
  유: [{ stem: "신", weight: 1 }],
  술: [
    { stem: "무", weight: 0.6 },
    { stem: "신", weight: 0.25 },
    { stem: "정", weight: 0.15 },
  ],
  해: [
    { stem: "임", weight: 0.7 },
    { stem: "갑", weight: 0.3 },
  ],
};

const GENERATING_MAP: Record<ElementKey, ElementKey> = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};

const CONTROLLING_MAP: Record<ElementKey, ElementKey> = {
  wood: "earth",
  fire: "metal",
  earth: "water",
  metal: "wood",
  water: "fire",
};

export function createEmptyElements(): ElementCount {
  return { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
}

export function createEmptyTenGods(): TenGodCount {
  return {
    비견: 0,
    겁재: 0,
    식신: 0,
    상관: 0,
    편재: 0,
    정재: 0,
    편관: 0,
    정관: 0,
    편인: 0,
    정인: 0,
  };
}

export function getGeneratingElement(target: ElementKey): ElementKey {
  return (Object.entries(GENERATING_MAP).find(([, value]) => value === target)?.[0] ??
    "wood") as ElementKey;
}

export function getGeneratedElement(source: ElementKey): ElementKey {
  return GENERATING_MAP[source];
}

export function getControlledElement(source: ElementKey): ElementKey {
  return CONTROLLING_MAP[source];
}

export function getControllingElement(target: ElementKey): ElementKey {
  return (Object.entries(CONTROLLING_MAP).find(([, value]) => value === target)?.[0] ??
    "wood") as ElementKey;
}

export function getElementLabel(element: ElementKey): string {
  return ELEMENT_LABELS[element];
}

export function getStemElement(stem: string): ElementKey {
  return STEM_ELEMENT_MAP[stem];
}

export function getStemYinYang(stem: string): "yang" | "yin" {
  return STEM_YIN_YANG_MAP[stem];
}

export function roundElementCount(elements: ElementCount): ElementCount {
  return {
    wood: Number(elements.wood.toFixed(2)),
    fire: Number(elements.fire.toFixed(2)),
    earth: Number(elements.earth.toFixed(2)),
    metal: Number(elements.metal.toFixed(2)),
    water: Number(elements.water.toFixed(2)),
  };
}

export function roundTenGodCount(counts: TenGodCount): TenGodCount {
  return Object.fromEntries(
    Object.entries(counts).map(([key, value]) => [key, Number(value.toFixed(2))]),
  ) as TenGodCount;
}

export function getTenGod(dayStem: string, targetStem: string): TenGodName {
  const dayElement = getStemElement(dayStem);
  const targetElement = getStemElement(targetStem);
  const samePolarity = getStemYinYang(dayStem) === getStemYinYang(targetStem);

  if (dayElement === targetElement) {
    return samePolarity ? "비견" : "겁재";
  }
  if (getGeneratedElement(dayElement) === targetElement) {
    return samePolarity ? "식신" : "상관";
  }
  if (getControlledElement(dayElement) === targetElement) {
    return samePolarity ? "편재" : "정재";
  }
  if (getControllingElement(dayElement) === targetElement) {
    return samePolarity ? "편관" : "정관";
  }
  return samePolarity ? "편인" : "정인";
}

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

/**
 * 한글/한자 둘 다 지원
 */
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

  甲: "wood",
  乙: "wood",
  丙: "fire",
  丁: "fire",
  戊: "earth",
  己: "earth",
  庚: "metal",
  辛: "metal",
  壬: "water",
  癸: "water",
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

  甲: "yang",
  乙: "yin",
  丙: "yang",
  丁: "yin",
  戊: "yang",
  己: "yin",
  庚: "yang",
  辛: "yin",
  壬: "yang",
  癸: "yin",
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

  子: "water",
  丑: "earth",
  寅: "wood",
  卯: "wood",
  辰: "earth",
  巳: "fire",
  午: "fire",
  未: "earth",
  申: "metal",
  酉: "metal",
  戌: "earth",
  亥: "water",
};

export const HIDDEN_STEMS_MAP: Record<
  string,
  Array<{ stem: string; weight: number }>
> = {
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

  子: [{ stem: "癸", weight: 1 }],
  丑: [
    { stem: "己", weight: 0.6 },
    { stem: "癸", weight: 0.25 },
    { stem: "辛", weight: 0.15 },
  ],
  寅: [
    { stem: "甲", weight: 0.6 },
    { stem: "丙", weight: 0.25 },
    { stem: "戊", weight: 0.15 },
  ],
  卯: [{ stem: "乙", weight: 1 }],
  辰: [
    { stem: "戊", weight: 0.6 },
    { stem: "乙", weight: 0.25 },
    { stem: "癸", weight: 0.15 },
  ],
  巳: [
    { stem: "丙", weight: 0.6 },
    { stem: "戊", weight: 0.25 },
    { stem: "庚", weight: 0.15 },
  ],
  午: [
    { stem: "丁", weight: 0.7 },
    { stem: "己", weight: 0.3 },
  ],
  未: [
    { stem: "己", weight: 0.6 },
    { stem: "丁", weight: 0.25 },
    { stem: "乙", weight: 0.15 },
  ],
  申: [
    { stem: "庚", weight: 0.6 },
    { stem: "壬", weight: 0.25 },
    { stem: "戊", weight: 0.15 },
  ],
  酉: [{ stem: "辛", weight: 1 }],
  戌: [
    { stem: "戊", weight: 0.6 },
    { stem: "辛", weight: 0.25 },
    { stem: "丁", weight: 0.15 },
  ],
  亥: [
    { stem: "壬", weight: 0.7 },
    { stem: "甲", weight: 0.3 },
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
    bigyeon: 0,
    geopjae: 0,
    siksin: 0,
    sanggwan: 0,
    pyeonjae: 0,
    jeongjae: 0,
    pyeongwan: 0,
    jeonggwan: 0,
    pyeonin: 0,
    jeongin: 0,
  };
}

export function getGeneratingElement(target: ElementKey): ElementKey {
  return (Object.entries(GENERATING_MAP).find(
    ([, value]) => value === target,
  )?.[0] ?? "wood") as ElementKey;
}

export function getGeneratedElement(source: ElementKey): ElementKey {
  return GENERATING_MAP[source];
}

export function getControlledElement(source: ElementKey): ElementKey {
  return CONTROLLING_MAP[source];
}

export function getControllingElement(target: ElementKey): ElementKey {
  return (Object.entries(CONTROLLING_MAP).find(
    ([, value]) => value === target,
  )?.[0] ?? "wood") as ElementKey;
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
    Object.entries(counts).map(([key, value]) => [
      key,
      Number(value.toFixed(2)),
    ]),
  ) as TenGodCount;
}

export function getTenGod(dayStem: string, targetStem: string): TenGodName {
  const dayElement = getStemElement(dayStem);
  const targetElement = getStemElement(targetStem);
  const samePolarity = getStemYinYang(dayStem) === getStemYinYang(targetStem);

  if (dayElement === targetElement) {
    return samePolarity ? "bigyeon" : "geopjae";
  }
  if (getGeneratedElement(dayElement) === targetElement) {
    return samePolarity ? "siksin" : "sanggwan";
  }
  if (getControlledElement(dayElement) === targetElement) {
    return samePolarity ? "pyeonjae" : "jeongjae";
  }
  if (getControllingElement(dayElement) === targetElement) {
    return samePolarity ? "pyeongwan" : "jeonggwan";
  }
  return samePolarity ? "pyeonin" : "jeongin";
}
export const TEN_GOD_LABELS: Record<TenGodName, string> = {
  bigyeon: "비견",
  geopjae: "겁재",
  siksin: "식신",
  sanggwan: "상관",
  pyeonjae: "편재",
  jeongjae: "정재",
  pyeongwan: "편관",
  jeonggwan: "정관",
  pyeonin: "편인",
  jeongin: "정인",
};

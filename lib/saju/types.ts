export type UserFortuneInput = {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  category: string;
  question: string;
};

export type SajuPillars = {
  year: string;
  month: string;
  day: string;
  hour: string;
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  hourStem: string;
  hourBranch: string;
};

export type ElementCount = {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
};

export type StrengthResult = {
  dayElement: keyof ElementCount;
  strength: "strong" | "weak";
};

export type YongSinResult = {
  yongsin: string;
  heesin: string;
  gisin: string;
};

export type Daewoon = {
  age: number;
  pillar: string;
};

export type DaewoonResult = {
  startAge: number;
  currentAge: number;
  daewoon: string;
  list: Daewoon[];
};

export type SajuAnalysis = {
  saju: SajuPillars;
  elements: ElementCount;
  strength: StrengthResult;
  yongsin: YongSinResult;
  daewoon: DaewoonResult;
  sewoon: string;
};

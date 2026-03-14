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
  yearHiddenStems: string[];
  monthHiddenStems: string[];
  dayHiddenStems: string[];
  hourHiddenStems: string[];
};

export type ElementKey = "wood" | "fire" | "earth" | "metal" | "water";

export type ElementCount = Record<ElementKey, number>;

export type ElementBreakdown = {
  stems: ElementCount;
  branches: ElementCount;
  hiddenStems: ElementCount;
  total: ElementCount;
};

export type StrengthResult = {
  dayElement: ElementKey;
  strength: "strong" | "weak";
  score: number;
  seasonSupport: number;
  rootCount: number;
  favorableElements: string[];
  unfavorableElements: string[];
  summary: string;
};

export type YongSinResult = {
  yongsin: string;
  heesin: string;
  gisin: string;
  supportElements: string[];
  cautionElements: string[];
  reason: string;
};

export type Daewoon = {
  age: number;
  pillar: string;
};

export type DaewoonResult = {
  startAge: number;
  currentAge: number;
  daewoon: string;
  direction: "forward" | "backward";
  list: Daewoon[];
  note: string;
  basisSolarTerm: string;
  basisDate: string;
  daysToStart: number;
};

export type TenGodName =
  | "비견"
  | "겁재"
  | "식신"
  | "상관"
  | "편재"
  | "정재"
  | "편관"
  | "정관"
  | "편인"
  | "정인";

export type TenGodCount = Record<TenGodName, number>;

export type TenGodSummary = {
  stems: TenGodCount;
  hiddenStems: TenGodCount;
  total: TenGodCount;
  dominant: TenGodName[];
  weak: TenGodName[];
  summary: string;
};

export type RelationPair = {
  target: string;
  type: "합" | "충" | "형" | "파" | "해";
  source: string;
  weight: number;
  note: string;
};

export type RelationSummary = {
  natal: RelationPair[];
  year: RelationPair[];
  summary: string;
};

export type SeWoonDetail = {
  year: number;
  pillar: string;
  stem: string;
  branch: string;
  stemElement: string;
  branchElement: string;
  relation: string;
  note: string;
};

export type MonthlyFortune = {
  month: number;
  pillar: string;
  score: number;
  keywords: string[];
};

export type SajuAnalysis = {
  saju: SajuPillars;
  elements: ElementCount;
  elementBreakdown: ElementBreakdown;
  strength: StrengthResult;
  yongsin: YongSinResult;
  daewoon: DaewoonResult;
  sewoon: string;
  sewoonDetail: SeWoonDetail;
  tenGods: TenGodSummary;
  relations: RelationSummary;
  monthlyFortune: MonthlyFortune[];
};

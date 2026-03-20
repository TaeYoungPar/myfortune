export type CalendarType = "solar" | "lunar";

export type UserFortuneInput = {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  calendarType?: CalendarType;
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
  | "bigyeon"
  | "geopjae"
  | "siksin"
  | "sanggwan"
  | "pyeonjae"
  | "jeongjae"
  | "pyeongwan"
  | "jeonggwan"
  | "pyeonin"
  | "jeongin";

export type TenGodCount = Record<TenGodName, number>;

export type TenGodSummary = {
  stems: TenGodCount;
  hiddenStems: TenGodCount;
  total: TenGodCount;
  dominant: TenGodName[];
  weak: TenGodName[];
  summary: string;
};

export type RelationType = "합" | "충" | "형" | "파" | "해" | "삼합" | "반합";

export type RelationPair = {
  target: string;
  type: RelationType;
  source: string;
  weight: number;
  note: string;
};

export type RelationSummary = {
  natal: RelationPair[];
  year: RelationPair[];
  highlights: string[];
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
  score: number;
  keywords: string[];
  note: string;
};

export type MonthlyFortune = {
  month: number;
  pillar: string;
  score: number;
  favorable: boolean;
  keywords: string[];
  note: string;
};

export type BalanceResult = {
  gap: number;
  level: "balanced" | "slightly_unbalanced" | "unbalanced";
};

export type SajuSummary = {
  dayMaster: string;
  dayElement: string;
  strength: "strong" | "weak";
  strengthScore: number;
  balance: BalanceResult;
  dominantElements: string[];
  lackingElements: string[];
  yongsin: string;
  heesin: string;
  gisin: string;
  dominantTenGods: TenGodName[];
  weakTenGods: TenGodName[];
  relationHighlights: string[];
  currentDaewoon: string;
  currentSeWoon: string;
  currentSeWoonRelation: string;
  goodMonths: Array<{ month: number; pillar: string; score: number }>;
  cautionMonths: Array<{ month: number; pillar: string; score: number }>;
  coreMessage: string;
};

export type CompatibilitySummary = {
  score: number;
  grade: "A" | "B" | "C" | "D";
  strengths: string[];
  cautions: string[];
  summary: string;
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
  summary: SajuSummary;
};

export type CompatibilityAnalysis = SajuAnalysis & {
  partnerAnalysis: SajuAnalysis;
  compatibility: CompatibilitySummary;
};

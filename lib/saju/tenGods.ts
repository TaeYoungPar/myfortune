import { SajuPillars, TenGodSummary } from "./types";
import {
  HIDDEN_STEMS_MAP,
  createEmptyTenGods,
  getTenGod,
  roundTenGodCount,
} from "./stemsBranches";

const STEM_WEIGHT = 1;
const HIDDEN_WEIGHT_BASE = 0.7;

export function calculateTenGods(saju: SajuPillars): TenGodSummary {
  const stems = createEmptyTenGods();
  const hiddenStems = createEmptyTenGods();

  [saju.yearStem, saju.monthStem, saju.hourStem].forEach((stem) => {
    const key = getTenGod(saju.dayStem, stem);
    stems[key] += STEM_WEIGHT;
  });

  [saju.yearBranch, saju.monthBranch, saju.dayBranch, saju.hourBranch].forEach((branch) => {
    (HIDDEN_STEMS_MAP[branch] ?? []).forEach(({ stem, weight }) => {
      const key = getTenGod(saju.dayStem, stem);
      hiddenStems[key] += HIDDEN_WEIGHT_BASE * weight;
    });
  });

  const total = createEmptyTenGods();
  (Object.keys(total) as Array<keyof typeof total>).forEach((key) => {
    total[key] = stems[key] + hiddenStems[key];
  });

  const entries = Object.entries(total).sort((a, b) => b[1] - a[1]);
  const dominant = entries.slice(0, 2).map(([key]) => key) as TenGodSummary["dominant"];
  const weak = entries.slice(-2).map(([key]) => key) as TenGodSummary["weak"];

  return {
    stems: roundTenGodCount(stems),
    hiddenStems: roundTenGodCount(hiddenStems),
    total: roundTenGodCount(total),
    dominant,
    weak,
    summary: `주요 십성은 ${dominant.join(", ")} 쪽이 강하고, ${weak.join(", ")} 쪽은 상대적으로 약합니다.`,
  };
}

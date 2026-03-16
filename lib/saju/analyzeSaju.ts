import { UserFortuneInput, SajuAnalysis } from "./types";
import { calculateSaju } from "./calculateSaju";
import { calculateElementsWithBreakdown } from "./elements";
import { calculateStrength } from "./strength";
import { calculateYongSin } from "./yongsin";
import { calculateDaewoon } from "./calculateDaewoon";
import { calculateSeWoon, calculateSeWoonDetail } from "./sewoon";
import { calculateTenGods } from "./tenGods";
import { analyzeRelations } from "./relations";
import { calculateMonthlyFortune } from "./monthlyFortune";
import { buildSajuSummary } from "./summary";

export function analyzeSaju(user: UserFortuneInput): SajuAnalysis {
  const saju = calculateSaju(user.birthDate, user.birthTime);
  const elementBreakdown = calculateElementsWithBreakdown(saju);
  const elements = elementBreakdown.total;
  const strength = calculateStrength(saju, elements);
  const yongsin = calculateYongSin(elements, strength);
  const sewoonDetail = calculateSeWoonDetail(saju);

  const daewoon = calculateDaewoon(
    user.birthDate,
    user.gender,
    saju.monthStem,
    saju.monthBranch,
    saju.yearStem,
  );

  const tenGods = calculateTenGods(saju);
  const relations = analyzeRelations(saju, sewoonDetail.branch);
  const monthlyFortune = calculateMonthlyFortune(elements, strength, sewoonDetail.year);
  const sewoon = calculateSeWoon(saju);

  const analysisBase = {
    saju,
    elements,
    elementBreakdown,
    strength,
    yongsin,
    daewoon,
    sewoon,
    sewoonDetail,
    tenGods,
    relations,
    monthlyFortune,
  };

  return {
    ...analysisBase,
    summary: buildSajuSummary(analysisBase),
  };
}

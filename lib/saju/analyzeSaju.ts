import { UserFortuneInput, SajuAnalysis } from "./types";
import { calculateSaju } from "./calculateSaju";
import { calculateElements } from "./elements";
import { calculateStrength } from "./strength";
import { calculateYongSin } from "./yongsin";
import { calculateDaewoon } from "./daewoon";
import { calculateSeWoon } from "./sewoon";

export function analyzeSaju(user: UserFortuneInput): SajuAnalysis {
  const saju = calculateSaju(user.birthDate, user.birthTime);

  const elements = calculateElements(saju);

  const strength = calculateStrength(saju, elements);

  const yongsin = calculateYongSin(elements, strength);

  const daewoon = calculateDaewoon(
    user.birthDate,
    user.gender,
    saju.monthStem,
    saju.monthBranch,
    saju.dayStem,
  );

  const sewoon = calculateSeWoon();

  return {
    saju,
    elements,
    strength,
    yongsin,
    daewoon,
    sewoon,
  };
}

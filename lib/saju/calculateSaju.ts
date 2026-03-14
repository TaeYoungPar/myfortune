import { Solar } from "./lunar";
import { HIDDEN_STEMS_MAP } from "./stemsBranches";
import { SajuPillars } from "./types";

export function calculateSaju(
  birthDate: string,
  birthTime: string,
): SajuPillars {
  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, minute] = (birthTime || "00:00").split(":").map(Number);

  const solar = Solar.fromYmdHms(
    year,
    month,
    day,
    Number.isNaN(hour) ? 0 : hour,
    Number.isNaN(minute) ? 0 : minute,
    0,
  );

  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const yearBranch = eightChar.getYearZhi();
  const monthBranch = eightChar.getMonthZhi();
  const dayBranch = eightChar.getDayZhi();
  const hourBranch = eightChar.getTimeZhi();

  return {
    year: eightChar.getYear(),
    month: eightChar.getMonth(),
    day: eightChar.getDay(),
    hour: eightChar.getTime(),

    yearStem: eightChar.getYearGan(),
    yearBranch,
    monthStem: eightChar.getMonthGan(),
    monthBranch,
    dayStem: eightChar.getDayGan(),
    dayBranch,
    hourStem: eightChar.getTimeGan(),
    hourBranch,

    yearHiddenStems: (HIDDEN_STEMS_MAP[yearBranch] ?? []).map(
      (item) => item.stem,
    ),
    monthHiddenStems: (HIDDEN_STEMS_MAP[monthBranch] ?? []).map(
      (item) => item.stem,
    ),
    dayHiddenStems: (HIDDEN_STEMS_MAP[dayBranch] ?? []).map(
      (item) => item.stem,
    ),
    hourHiddenStems: (HIDDEN_STEMS_MAP[hourBranch] ?? []).map(
      (item) => item.stem,
    ),
  };
}

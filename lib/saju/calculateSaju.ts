import { Solar } from "lunar-javascript";
import { SajuPillars } from "./types";

export function calculateSaju(
  birthDate: string,
  birthTime: string,
): SajuPillars {
  const [year, month, day] = birthDate.split("-").map(Number);
  const hour = Number(birthTime.split(":")[0]);

  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  return {
    year: eightChar.getYear(),
    month: eightChar.getMonth(),
    day: eightChar.getDay(),
    hour: eightChar.getTime(),

    yearStem: eightChar.getYearGan(),
    yearBranch: eightChar.getYearZhi(),

    monthStem: eightChar.getMonthGan(),
    monthBranch: eightChar.getMonthZhi(),

    dayStem: eightChar.getDayGan(),
    dayBranch: eightChar.getDayZhi(),

    hourStem: eightChar.getTimeGan(),
    hourBranch: eightChar.getTimeZhi(),
  };
}

import { Lunar, Solar } from "./lunar";
import { HIDDEN_STEMS_MAP } from "./stemsBranches";
import { SajuPillars } from "./types";

type CalendarType = "solar" | "lunar";

function normalizeCalendarType(calendarType?: string): CalendarType {
  return calendarType === "lunar" ? "lunar" : "solar";
}

function parseBirthDate(birthDate: string) {
  const [year, month, day] = birthDate.split("-").map(Number);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    throw new Error(`잘못된 birthDate 형식: ${birthDate}`);
  }

  return { year, month, day };
}

function parseBirthTime(birthTime?: string) {
  if (!birthTime || birthTime.trim() === "") {
    return { hour: 0, minute: 0, second: 0 };
  }

  const clean = birthTime.trim();
  const parts = clean.split(":");

  const rawHour = Number(parts[0] ?? 0);
  const rawMinute = Number(parts[1] ?? 0);
  const rawSecond = Number(parts[2] ?? 0);

  const hour = Number.isFinite(rawHour)
    ? Math.max(0, Math.min(23, rawHour))
    : 0;

  const minute = Number.isFinite(rawMinute)
    ? Math.max(0, Math.min(59, rawMinute))
    : 0;

  const second = Number.isFinite(rawSecond)
    ? Math.max(0, Math.min(59, rawSecond))
    : 0;

  return { hour, minute, second };
}

export function calculateSaju(
  birthDate: string,
  birthTime: string,
  calendarType: string = "solar",
): SajuPillars {
  const { year, month, day } = parseBirthDate(birthDate);
  const { hour, minute, second } = parseBirthTime(birthTime);

  const solar =
    normalizeCalendarType(calendarType) === "lunar"
      ? (() => {
          const solarDate = Lunar.fromYmd(year, month, day).getSolar();
          return Solar.fromYmdHms(
            solarDate.getYear(),
            solarDate.getMonth(),
            solarDate.getDay(),
            hour,
            minute,
            second,
          );
        })()
      : Solar.fromYmdHms(year, month, day, hour, minute, second);

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

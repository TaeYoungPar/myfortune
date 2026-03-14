/**
 * 1901~2100 근사 계산용 절(節) 시점.
 * 정밀 천문 계산은 아니지만, 고정 경계일보다 실제 운용 정확도가 높다.
 */
export type MajorSolarTermName =
  | "소한"
  | "입춘"
  | "경칩"
  | "청명"
  | "입하"
  | "망종"
  | "소서"
  | "입추"
  | "백로"
  | "한로"
  | "입동"
  | "대설";

const TERM_DATA: Array<{ name: MajorSolarTermName; month: number; c20: number; c21: number }> = [
  { name: "소한", month: 1, c20: 6.11, c21: 5.4055 },
  { name: "입춘", month: 2, c20: 4.6295, c21: 3.87 },
  { name: "경칩", month: 3, c20: 6.3826, c21: 5.63 },
  { name: "청명", month: 4, c20: 5.59, c21: 4.81 },
  { name: "입하", month: 5, c20: 6.318, c21: 5.52 },
  { name: "망종", month: 6, c20: 6.5, c21: 5.678 },
  { name: "소서", month: 7, c20: 7.928, c21: 7.108 },
  { name: "입추", month: 8, c20: 8.35, c21: 7.5 },
  { name: "백로", month: 9, c20: 8.44, c21: 7.646 },
  { name: "한로", month: 10, c20: 9.098, c21: 8.318 },
  { name: "입동", month: 11, c20: 8.218, c21: 7.438 },
  { name: "대설", month: 12, c20: 7.9, c21: 7.18 },
];

function calcDay(year: number, cValue: number): number {
  const y = year % 100;
  return Math.floor(y * 0.2422 + cValue) - Math.floor((y - 1) / 4);
}

export function getMajorSolarTermsForYear(year: number): Array<{ name: MajorSolarTermName; date: Date }> {
  const century = year >= 2001 ? "c21" : "c20";

  return TERM_DATA.map((term) => {
    const day = calcDay(year, term[century]);
    return {
      name: term.name,
      date: new Date(year, term.month - 1, day, 12, 0, 0),
    };
  });
}

export function findNearestMajorSolarTerms(date: Date) {
  const candidates = [
    ...getMajorSolarTermsForYear(date.getFullYear() - 1),
    ...getMajorSolarTermsForYear(date.getFullYear()),
    ...getMajorSolarTermsForYear(date.getFullYear() + 1),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  let prev = candidates[0];
  let next = candidates[candidates.length - 1];

  for (let i = 0; i < candidates.length; i += 1) {
    const current = candidates[i];
    if (current.date.getTime() <= date.getTime()) {
      prev = current;
    }
    if (current.date.getTime() > date.getTime()) {
      next = current;
      break;
    }
  }

  return { prev, next };
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

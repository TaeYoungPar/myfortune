import { ElementCount } from "./types";

export type MonthlyFortune = {
  month: number;
  score: number;
};

export function calculateMonthlyFortune(
  elements: ElementCount,
): MonthlyFortune[] {
  const months: MonthlyFortune[] = [];

  for (let i = 1; i <= 12; i++) {
    const score =
      elements.wood * Math.random() +
      elements.fire * Math.random() +
      elements.earth * Math.random() +
      elements.metal * Math.random() +
      elements.water * Math.random();

    months.push({
      month: i,
      score: Math.round(score * 10),
    });
  }

  return months;
}

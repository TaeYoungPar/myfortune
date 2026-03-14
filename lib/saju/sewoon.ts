import { Solar } from "lunar-javascript";

export function calculateSeWoon(): string {
  const now = new Date();

  const solar = Solar.fromYmd(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );

  const lunar = solar.getLunar();

  return lunar.getYearInGanZhi();
}

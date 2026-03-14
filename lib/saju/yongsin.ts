import { ElementCount } from "./types";
import { StrengthResult } from "./strength";

export type YongSinResult = {
  yongsin: string;
  heesin: string;
  gisin: string;
};

export function calculateYongSin(
  elements: ElementCount,
  strength: StrengthResult,
): YongSinResult {
  const order = Object.entries(elements).sort((a, b) => a[1] - b[1]);

  const 부족 = order[0][0];
  const 과다 = order[order.length - 1][0];

  if (strength.strength === "weak") {
    return {
      yongsin: 부족,
      heesin: order[1][0],
      gisin: 과다,
    };
  }

  return {
    yongsin: 과다,
    heesin: order[order.length - 2][0],
    gisin: 부족,
  };
}

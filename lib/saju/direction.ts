const yangStems = ["갑", "병", "무", "경", "임"];

export function getDaewoonDirection(
  gender: string,
  yearStem: string,
): 1 | -1 {
  const normalized = gender?.toLowerCase();
  const isMale = normalized === "male" || normalized === "m" || normalized === "남" || normalized === "남성";
  const isYangYear = yangStems.includes(yearStem);

  return isMale ? (isYangYear ? 1 : -1) : isYangYear ? -1 : 1;
}

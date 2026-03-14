const yangStems = ["갑", "병", "무", "경", "임"];

export function getDaewoonDirection(gender: string, dayStem: string) {
  const isYang = yangStems.includes(dayStem);

  if (gender === "male") {
    return isYang ? 1 : -1;
  }

  return isYang ? -1 : 1;
}

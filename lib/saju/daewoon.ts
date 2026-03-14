import { DaewoonResult } from "./types";

export function calculateDaewoon(birthYear: number): DaewoonResult {
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;

  const startAge = 10;

  const daewoonList = [
    "경진",
    "신사",
    "임오",
    "계미",
    "갑신",
    "을유",
    "병술",
    "정해",
  ];

  const list = daewoonList.map((pillar, index) => ({
    age: startAge + index * 10,
    pillar,
  }));

  const currentIndex = Math.floor((currentAge - startAge) / 10);

  return {
    startAge,
    currentAge,
    daewoon: list[currentIndex]?.pillar ?? list[0].pillar,
    list,
  };
}

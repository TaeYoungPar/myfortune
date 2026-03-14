import { DaewoonResult } from "./types";
import { stems, branches } from "./stemsBranches";
import { getDaewoonDirection } from "./direction";

export function calculateDaewoon(
  birthDate: string,
  gender: string,
  monthStem: string,
  monthBranch: string,
  dayStem: string,
): DaewoonResult {
  const birth = new Date(birthDate);
  const now = new Date();

  const age = now.getFullYear() - birth.getFullYear();

  // 절기 근사 계산
  const nextSeason = new Date(birth.getFullYear(), birth.getMonth() + 1, 4);

  const diff = (nextSeason.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24);

  const startAge = Math.floor(diff / 3);

  const direction = getDaewoonDirection(gender, dayStem);

  const stemIndex = stems.indexOf(monthStem);
  const branchIndex = branches.indexOf(monthBranch);

  const list: { age: number; pillar: string }[] = [];

  for (let i = 0; i < 8; i++) {
    const s = stems[(stemIndex + direction * (i + 1) + 10) % 10];
    const b = branches[(branchIndex + direction * (i + 1) + 12) % 12];

    list.push({
      age: startAge + i * 10,
      pillar: s + b,
    });
  }

  const current = list.find(
    (d, i) => age >= d.age && age < (list[i + 1]?.age ?? 100),
  );

  return {
    startAge,
    currentAge: age,
    daewoon: current?.pillar ?? list[0].pillar,
    list,
  };
}

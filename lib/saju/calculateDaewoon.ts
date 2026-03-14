import { DaewoonResult } from "./types";
import { stems, branches } from "./stemsBranches";
import { getDaewoonDirection } from "./direction";
import { findNearestMajorSolarTerms, formatDate } from "./solarTerms";

function calculateCurrentAge(birthDate: Date, now: Date) {
  let age = now.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

export function calculateDaewoon(
  birthDate: string,
  gender: string,
  monthStem: string,
  monthBranch: string,
  yearStem: string,
): DaewoonResult {
  const birth = new Date(`${birthDate}T12:00:00`);
  const now = new Date();

  const currentAge = calculateCurrentAge(birth, now);
  const directionStep = getDaewoonDirection(gender, yearStem);
  const direction = directionStep === 1 ? "forward" : "backward";

  const { prev, next } = findNearestMajorSolarTerms(birth);
  const basis = directionStep === 1 ? next : prev;

  const diffDays = Math.max(
    1,
    Math.round(Math.abs(basis.date.getTime() - birth.getTime()) / 86400000),
  );

  const startAge = Math.max(1, Math.round(diffDays / 3));

  const stemIndex = stems.indexOf(monthStem as (typeof stems)[number]);
  const branchIndex = branches.indexOf(monthBranch as (typeof branches)[number]);

  const list = Array.from({ length: 8 }, (_, index) => {
    const step = directionStep * (index + 1);
    const stem = stems[(stemIndex + step + stems.length) % stems.length];
    const branch = branches[(branchIndex + step + branches.length) % branches.length];

    return {
      age: startAge + index * 10,
      pillar: `${stem}${branch}`,
    };
  });

  const current =
    list.find(
      (item, index) =>
        currentAge >= item.age && currentAge < (list[index + 1]?.age ?? 999),
    ) ?? list[0];

  return {
    startAge,
    currentAge,
    daewoon: current.pillar,
    direction,
    list,
    note:
      "절입 시각 천문 계산은 아니지만, 12절 경계 계산을 사용해 기존 고정일 방식보다 더 정교하게 대운 시작 나이를 추정합니다.",
    basisSolarTerm: basis.name,
    basisDate: formatDate(basis.date),
    daysToStart: diffDays,
  };
}

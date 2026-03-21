import { DaewoonResult, Gender } from "./types";
import { stems, branches } from "./stemsBranches";
import { getDaewoonDirection } from "./direction";
import { findNearestMajorSolarTerms, formatDate } from "./solarTerms";

function calculateCurrentAge(birthDate: Date, now: Date) {
  let age = now.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() &&
      now.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

function round1(value: number) {
  return Number(value.toFixed(1));
}

export function calculateDaewoon(
  birthDate: string,
  gender: Gender,
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

  const diffMs = Math.abs(basis.date.getTime() - birth.getTime());
  const diffDays = Math.max(1, Math.round(diffMs / 86400000));

  /**
   * 전통적으로 많이 쓰는 “3일 = 1년” 근사.
   * 기존처럼 정수 반올림만 하지 말고 0.1살 단위로 남겨서
   * 경계 연령에서 덜 거칠게 보이도록 처리.
   */
  const startAgeRaw = diffDays / 3;
  const startAge = Math.max(1, round1(startAgeRaw));

  const stemIndex = stems.indexOf(monthStem as (typeof stems)[number]);
  const branchIndex = branches.indexOf(
    monthBranch as (typeof branches)[number],
  );

  const list = Array.from({ length: 8 }, (_, index) => {
    const step = directionStep * (index + 1);
    const stem = stems[(stemIndex + step + stems.length) % stems.length];
    const branch =
      branches[(branchIndex + step + branches.length) % branches.length];

    return {
      age: round1(startAge + index * 10),
      pillar: `${stem}${branch}`,
    };
  });

  let currentIndex = list.findIndex((item, index) => {
    const nextAge = list[index + 1]?.age ?? 999;
    return currentAge >= item.age && currentAge < nextAge;
  });

  if (currentIndex < 0) {
    currentIndex = currentAge < list[0].age ? 0 : list.length - 1;
  }

  const current = list[currentIndex];
  const currentStartAge = current.age;
  const currentEndAge = list[currentIndex + 1]?.age ?? round1(current.age + 10);

  return {
    startAge,
    startAgeRaw: round1(startAgeRaw),
    currentAge,
    daewoon: current.pillar,
    direction,
    list,
    note: `출생 후 ${
      direction === "forward" ? "다음" : "이전"
    } 절(${basis.name})까지의 간격 ${diffDays}일을 기준으로 대운 시작 나이를 추정했습니다. 3일=1년 근사를 적용했고, 현재는 ${currentStartAge}세~${currentEndAge}세 구간의 ${current.pillar} 대운으로 봅니다.`,
    basisSolarTerm: basis.name,
    basisDate: formatDate(basis.date),
    daysToStart: diffDays,
    currentIndex,
    currentStartAge,
    currentEndAge,
  };
}

import { RelationPair, RelationSummary, SajuPillars } from "./types";

const 六合 = new Map([
  ["자축", "토로 묶이며 현실 정리력이 커집니다."],
  ["인해", "목으로 이어져 확장성과 연결이 커집니다."],
  ["묘술", "화로 이어져 표현력과 관계성이 살아납니다."],
  ["진유", "금으로 이어져 결과·정리 흐름이 생깁니다."],
  ["사신", "수로 이어져 이동·변화성이 커집니다."],
  ["오미", "화로 이어져 열정과 관계 온도가 올라갑니다."],
]);

const 六冲 = new Map([
  ["자오", "방향 충돌과 일정 변화가 잦아질 수 있습니다."],
  ["축미", "생활 기반과 책임 영역의 충돌이 생기기 쉽습니다."],
  ["인신", "이동·직장·역할 변화 압력이 커질 수 있습니다."],
  ["묘유", "관계와 평가 문제에서 예민함이 올라갈 수 있습니다."],
  ["진술", "기존 계획 수정, 기준 재정리가 필요해질 수 있습니다."],
  ["사해", "속도와 방향이 엇갈리기 쉬워 조절이 필요합니다."],
]);

const 六害 = new Map([
  ["자미", "감정 소모와 생활 리듬 엇갈림에 주의가 필요합니다."],
  ["축오", "의무와 감정이 어긋나기 쉬운 흐름입니다."],
  ["인사", "성급한 판단과 관계 긴장에 주의가 필요합니다."],
  ["묘진", "일 처리에서 미세한 엇박자가 생기기 쉽습니다."],
  ["신해", "사람·이동 문제에서 피로감이 누적될 수 있습니다."],
  ["유술", "평가와 결과를 두고 예민함이 커질 수 있습니다."],
]);

const 六破 = new Map([
  ["자유", "대인 흐름이 끊기거나 계획이 틀어지기 쉬울 수 있습니다."],
  ["묘오", "감정적 과속에 주의가 필요합니다."],
  ["진축", "생활 패턴을 재정비해야 할 수 있습니다."],
  ["미술", "집착하던 틀을 바꾸는 압력이 생길 수 있습니다."],
  ["인해", "좋은 연합이지만 과한 기대는 오히려 부담이 될 수 있습니다."],
  ["사신", "변화가 잦아 안정성이 떨어질 수 있습니다."],
]);

const 三刑 = [
  ["인", "사"],
  ["사", "신"],
  ["신", "인"],
  ["축", "술"],
  ["술", "미"],
  ["미", "축"],
  ["자", "묘"],
  ["묘", "자"],
  ["진", "진"],
  ["오", "오"],
  ["유", "유"],
  ["해", "해"],
] as const;

function key(a: string, b: string) {
  return [a, b].sort().join("");
}

function detectPair(a: string, b: string): RelationPair[] {
  const result: RelationPair[] = [];
  const pairKey = key(a, b);

  if (六合.has(pairKey)) {
    result.push({ target: b, source: a, type: "합", weight: 0.8, note: 六合.get(pairKey)! });
  }
  if (六冲.has(pairKey)) {
    result.push({ target: b, source: a, type: "충", weight: 1.2, note: 六冲.get(pairKey)! });
  }
  if (六害.has(pairKey)) {
    result.push({ target: b, source: a, type: "해", weight: 0.7, note: 六害.get(pairKey)! });
  }
  if (六破.has(pairKey)) {
    result.push({ target: b, source: a, type: "파", weight: 0.6, note: 六破.get(pairKey)! });
  }

  if (三刑.some(([x, y]) => x === a && y === b)) {
    result.push({
      target: b,
      source: a,
      type: "형",
      weight: 1,
      note: "압박감, 예민함, 반복 피로가 생기기 쉬운 구조입니다.",
    });
  }

  return result;
}

export function analyzeRelations(saju: SajuPillars, yearBranch?: string): RelationSummary {
  const natalBranches = [saju.yearBranch, saju.monthBranch, saju.dayBranch, saju.hourBranch];
  const natal: RelationPair[] = [];

  for (let i = 0; i < natalBranches.length; i += 1) {
    for (let j = i + 1; j < natalBranches.length; j += 1) {
      natal.push(...detectPair(natalBranches[i], natalBranches[j]));
    }
  }

  const year: RelationPair[] = [];
  if (yearBranch) {
    natalBranches.forEach((branch) => {
      year.push(...detectPair(yearBranch, branch));
    });
  }

  const relationTypes = [...natal, ...year].map((item) => item.type);
  const summary = relationTypes.length
    ? `합/충/형/파/해 중 ${relationTypes.join(", ")} 작용이 있어 관계·일정·심리 리듬 변화를 함께 봐야 합니다.`
    : "큰 충돌 신호는 약한 편이라 흐름을 안정적으로 해석할 수 있습니다.";

  return {
    natal,
    year,
    summary,
  };
}

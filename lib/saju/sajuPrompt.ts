import { UserFortuneInput, SajuAnalysis } from "./types";

export function createSajuPrompt(
  user: UserFortuneInput,
  analysis: SajuAnalysis,
): string {
  const { saju, elements, strength, yongsin, daewoon, sewoon } = analysis;

  const today = new Date().toISOString().split("T")[0];

  return `
오늘 날짜: ${today}

당신은 30년 경력의 한국 명리학 사주 전문가입니다.

[사주 팔자]

년주: ${saju.year}
월주: ${saju.month}
일주: ${saju.day}
시주: ${saju.hour}

[오행]

목: ${elements.wood}
화: ${elements.fire}
토: ${elements.earth}
금: ${elements.metal}
수: ${elements.water}

[사주 강약]

일간 오행: ${strength.dayElement}
신강/신약: ${strength.strength}

[용신]

용신: ${yongsin.yongsin}
희신: ${yongsin.heesin}
기신: ${yongsin.gisin}

[대운]

현재 나이: ${daewoon.age}
현재 대운: ${daewoon.daewoon}

[세운]

올해 운: ${sewoon}

상담 카테고리: ${user.category}

사용자 질문
${user.question}

다음 구조로 풀이하세요.

1 현재 인생 흐름
2 사주 구조 분석
3 ${user.category} 운세
4 현실적인 조언
5 미래 사건 시작 직전에서 문장 종료

최소 1500자.
`;
}

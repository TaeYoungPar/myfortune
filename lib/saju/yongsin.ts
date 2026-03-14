import { ElementCount, StrengthResult, YongSinResult } from "./types";
import {
  ELEMENT_LABELS,
  getControlledElement,
  getControllingElement,
  getGeneratedElement,
  getGeneratingElement,
} from "./stemsBranches";

function pickLeast(elements: ElementCount, candidates: Array<keyof ElementCount>) {
  return [...candidates].sort((a, b) => elements[a] - elements[b])[0];
}

function pickMost(elements: ElementCount, candidates: Array<keyof ElementCount>) {
  return [...candidates].sort((a, b) => elements[b] - elements[a])[0];
}

export function calculateYongSin(
  elements: ElementCount,
  strength: StrengthResult,
): YongSinResult {
  const dayElement = strength.dayElement;
  const resourceElement = getGeneratingElement(dayElement);
  const outputElement = getGeneratedElement(dayElement);
  const wealthElement = getControlledElement(dayElement);
  const powerElement = getControllingElement(dayElement);

  if (strength.strength === "weak") {
    const yongsinKey = pickLeast(elements, [resourceElement, dayElement]);
    const heesinKey = yongsinKey === resourceElement ? dayElement : resourceElement;
    const gisinKey = pickMost(elements, [outputElement, wealthElement, powerElement]);

    return {
      yongsin: ELEMENT_LABELS[yongsinKey],
      heesin: ELEMENT_LABELS[heesinKey],
      gisin: ELEMENT_LABELS[gisinKey],
      supportElements: [ELEMENT_LABELS[yongsinKey], ELEMENT_LABELS[heesinKey]],
      cautionElements: [
        ELEMENT_LABELS[outputElement],
        ELEMENT_LABELS[wealthElement],
        ELEMENT_LABELS[powerElement],
      ],
      reason:
        "신약 사주는 일간과 인성 보강이 우선이므로 나를 살리는 기운을 용신 축으로 잡았습니다.",
    };
  }

  const yongsinKey = pickLeast(elements, [outputElement, wealthElement, powerElement]);
  const heesinCandidates = [outputElement, wealthElement, powerElement].filter(
    (element) => element !== yongsinKey,
  );
  const heesinKey = pickLeast(elements, heesinCandidates);
  const gisinKey = pickMost(elements, [dayElement, resourceElement]);

  return {
    yongsin: ELEMENT_LABELS[yongsinKey],
    heesin: ELEMENT_LABELS[heesinKey],
    gisin: ELEMENT_LABELS[gisinKey],
    supportElements: [ELEMENT_LABELS[yongsinKey], ELEMENT_LABELS[heesinKey]],
    cautionElements: [ELEMENT_LABELS[dayElement], ELEMENT_LABELS[resourceElement]],
    reason:
      "신강 사주는 설기와 제어가 필요하므로 식상·재성·관성 쪽에서 균형을 잡는 방향으로 용신을 정했습니다.",
  };
}

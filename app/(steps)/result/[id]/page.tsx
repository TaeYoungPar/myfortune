"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import ReactMarkdown from "react-markdown";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { TEN_GOD_LABELS } from "@/lib/saju/stemsBranches";

function safeNormalizedText(value: unknown, fallback = "-") {
  return normalizeGanjiText(safeText(value, fallback));
}

const categoryLabelMap: Record<string, string> = {
  love: "연애운",
  reunion: "재회 가능성",
  crush: "짝사랑 성공률",
  contact: "연락운",
  compatibility: "궁합 분석",
  money: "재물운",
  career: "직장운",
  business: "사업운",
  year: "올해 운세",
  life: "인생 방향",
};

const strengthLabelMap: Record<string, string> = {
  strong: "기운이 강한 편",
  weak: "기운이 섬세한 편",
};

const strengthShortLabelMap: Record<string, string> = {
  strong: "신강",
  weak: "신약",
};

const balanceLabelMap: Record<string, string> = {
  balanced: "균형",
  slightly_unbalanced: "약간 불균형",
  unbalanced: "불균형",
};

const elementLabelMap = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

const chineseStemToKoreanMap: Record<string, string> = {
  甲: "갑",
  乙: "을",
  丙: "병",
  丁: "정",
  戊: "무",
  己: "기",
  庚: "경",
  辛: "신",
  壬: "임",
  癸: "계",
};

const chineseBranchToKoreanMap: Record<string, string> = {
  子: "자",
  丑: "축",
  寅: "인",
  卯: "묘",
  辰: "진",
  巳: "사",
  午: "오",
  未: "미",
  申: "신",
  酉: "유",
  戌: "술",
  亥: "해",
};

const stemFullLabelMap: Record<string, string> = {
  갑: "갑(큰 나무)",
  을: "을(풀·꽃)",
  병: "병(태양)",
  정: "정(촛불)",
  무: "무(큰 땅)",
  기: "기(기름진 흙)",
  경: "경(단단한 쇠)",
  신: "신(보석 같은 쇠)",
  임: "임(큰 바다)",
  계: "계(비와 이슬)",
};

const branchFullLabelMap: Record<string, string> = {
  자: "자(물의 시작)",
  축: "축(겨울 흙)",
  인: "인(봄의 시작)",
  묘: "묘(봄의 확장)",
  진: "진(흙의 전환점)",
  사: "사(초여름 불)",
  오: "오(강한 불)",
  미: "미(여름 흙)",
  신: "신(초가을 금)",
  유: "유(가을 금)",
  술: "술(마른 흙)",
  해: "해(겨울 물)",
};

const stemMeaningMap: Record<string, string> = {
  갑: "큰 나무 같은 기운",
  을: "풀과 꽃 같은 기운",
  병: "태양 같은 기운",
  정: "촛불 같은 기운",
  무: "큰 땅 같은 기운",
  기: "기름진 흙 같은 기운",
  경: "단단한 쇠 같은 기운",
  신: "보석 같은 쇠 기운",
  임: "큰 바다 같은 기운",
  계: "비와 이슬 같은 기운",
};

const tenGodMeaningMap: Record<string, string> = {
  bigyeon: "나와 비슷한 성향",
  geopjae: "경쟁·동료 성향",
  siksin: "꾸준히 해내는 성향",
  sanggwan: "표현력·개성 성향",
  pyeonjae: "기회·활동성 성향",
  jeongjae: "안정적 재물 감각",
  pyeongwan: "압박·도전 성향",
  jeonggwan: "책임·직장 성향",
  pyeonin: "직감·몰입 성향",
  jeongin: "배움·보호 성향",
};

function safeText(value: unknown, fallback = "-") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function toArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function toNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeGanjiText(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "";

  return value
    .split("")
    .map((char) => {
      if (chineseStemToKoreanMap[char]) return chineseStemToKoreanMap[char];
      if (chineseBranchToKoreanMap[char]) return chineseBranchToKoreanMap[char];
      return char;
    })
    .join("");
}

function formatStrength(value: unknown) {
  if (typeof value !== "string") return "-";
  return strengthLabelMap[value] ?? value;
}

function formatStrengthWithTerm(value: unknown) {
  if (typeof value !== "string") return "-";
  const label = strengthLabelMap[value] ?? value;
  const short = strengthShortLabelMap[value];
  return short ? `${label} (${short})` : label;
}

function formatBalanceLevel(value: unknown) {
  if (typeof value !== "string") return "-";
  return balanceLabelMap[value] ?? value;
}

function formatFlowDirection(value: unknown) {
  if (value === "forward") return "순행";
  if (value === "backward") return "역행";
  return "-";
}

function formatStem(value: unknown) {
  const normalized = normalizeGanjiText(value);
  if (!normalized) return "-";
  return stemFullLabelMap[normalized] ?? normalized;
}

function formatBranch(value: unknown) {
  const normalized = normalizeGanjiText(value);
  if (!normalized) return "-";
  return branchFullLabelMap[normalized] ?? normalized;
}

function formatPillar(value: unknown) {
  const normalized = normalizeGanjiText(value);
  if (!normalized) return "-";
  if (normalized.length < 2) return normalized;

  const stem = normalized[0];
  const branch = normalized[1];

  const stemLabel = stemFullLabelMap[stem] ?? stem;
  const branchLabel = branchFullLabelMap[branch] ?? branch;

  return `${normalized} (${stemLabel} · ${branchLabel})`;
}

function formatPillarCompact(value: unknown) {
  const normalized = normalizeGanjiText(value);
  return normalized || "-";
}

function formatPillarFromParts(stemValue: unknown, branchValue: unknown) {
  const stem = normalizeGanjiText(stemValue);
  const branch = normalizeGanjiText(branchValue);

  if (!stem && !branch) return "-";
  if (!stem || !branch) return `${stem}${branch}` || "-";

  return `${stem}${branch} (${formatStem(stem)} · ${formatBranch(branch)})`;
}

function getDayStemMeaning(value: unknown) {
  const normalized = normalizeGanjiText(value);
  if (!normalized) return "-";
  return stemMeaningMap[normalized] ?? normalized;
}

function getTenGodLabel(value: unknown) {
  if (typeof value !== "string") return "-";
  return TEN_GOD_LABELS[value as keyof typeof TEN_GOD_LABELS] ?? value;
}

function getTenGodMeaning(value: unknown) {
  if (typeof value !== "string") return "-";
  return tenGodMeaningMap[value] ?? getTenGodLabel(value);
}

function normalizeReportMarkdown(text: string) {
  return text
    .replace(/^1\.\s*(.+)$/gm, "## 1. $1")
    .replace(/^2\.\s*(.+)$/gm, "## 2. $1")
    .replace(/^3\.\s*(.+)$/gm, "## 3. $1")
    .replace(/^4\.\s*(.+)$/gm, "## 4. $1")
    .replace(/^5\.\s*(.+)$/gm, "## 5. $1")
    .replace(/^6\.\s*(.+)$/gm, "## 6. $1");
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow ? (
        <div className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-purple-300/80">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function InfoCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "highlight";
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-5",
        tone === "highlight"
          ? "border-purple-400/20 bg-gradient-to-br from-purple-500/12 to-white/5"
          : "border-white/10 bg-white/[0.04]",
      ].join(" ")}
    >
      <div className="text-xs text-gray-400">{label}</div>
      <div className="mt-3 text-lg font-semibold leading-relaxed text-white">
        {value}
      </div>
      {sub ? (
        <div className="mt-2 text-sm leading-6 text-gray-400">{sub}</div>
      ) : null}
    </div>
  );
}

export default function ResultPage() {
  const params = useParams();

  const id =
    typeof params.id === "string" ? (params.id as Id<"fortunes">) : undefined;

  const fortune = useQuery(api.fortunes.getFortune, id ? { id } : "skip");

  const analysis = fortune?.analysis;
  const compatibility = analysis?.compatibility;
  const partnerAnalysis = analysis?.partnerAnalysis;
  const summary = analysis?.summary;

  const categoryLabel =
    categoryLabelMap[fortune?.user?.category ?? ""] ?? "AI 사주 분석";

  const dominantElements = useMemo(() => {
    if (!analysis?.elements) return [];

    return Object.entries(analysis.elements)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 2)
      .map(([key, value]) => ({
        key,
        label: elementLabelMap[key as keyof typeof elementLabelMap] ?? key,
        value: Number(value),
      }));
  }, [analysis]);

  const lackingElements = useMemo(() => {
    if (!analysis?.elements) return [];

    return Object.entries(analysis.elements)
      .sort((a, b) => Number(a[1]) - Number(b[1]))
      .slice(0, 2)
      .map(([key, value]) => ({
        key,
        label: elementLabelMap[key as keyof typeof elementLabelMap] ?? key,
        value: Number(value),
      }));
  }, [analysis]);

  const goodMonths = useMemo(() => {
    if (!analysis?.monthlyFortune) return [];
    return [...analysis.monthlyFortune]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [analysis]);

  const cautionMonths = useMemo(() => {
    if (!analysis?.monthlyFortune) return [];
    return [...analysis.monthlyFortune]
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  }, [analysis]);

  const reasoningList = useMemo(
    () => toArray(summary?.reasoning).map(normalizeGanjiText).slice(0, 6),
    [summary],
  );

  const sewoonEvidenceList = useMemo(
    () =>
      toArray(analysis?.sewoonDetail?.evidence)
        .map(normalizeGanjiText)
        .slice(0, 6),
    [analysis],
  );

  const compatibilityEvidenceList = useMemo(
    () => toArray(compatibility?.evidence).map(normalizeGanjiText).slice(0, 6),
    [compatibility],
  );

  const relationHighlights = useMemo(
    () =>
      toArray(analysis?.relations?.highlights)
        .map(normalizeGanjiText)
        .slice(0, 5),
    [analysis],
  );

  const heroChips = useMemo(() => {
    const items = [
      normalizeGanjiText(summary?.yongsin),
      formatPillarCompact(summary?.currentDaewoon),
      formatPillarCompact(summary?.currentSeWoon),
      safeText(summary?.currentSeWoonRelation, ""),
    ].filter((item) => item && item !== "-");

    return [...new Set(items)].slice(0, 4);
  }, [summary]);

  if (!fortune) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090B10] px-6 text-white">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl">
          <p className="text-gray-300">결과를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090B10] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-[30rem] w-[30rem] rounded-full bg-purple-700/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-indigo-700/10 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-200">
              {categoryLabel}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              {fortune.user.category === "compatibility" && fortune.user.partner
                ? `${safeText(fortune.user.name)}님 · ${safeText(
                    fortune.user.partner.name,
                  )}님 결과`
                : `${safeText(fortune.user.name)}님의 결과 리포트`}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
              {safeNormalizedText(
                analysis?.strength?.summary,
                "사주 원국과 현재 흐름을 바탕으로 핵심 내용을 정리했습니다.",
              )}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-gray-200"
            >
              홈으로
            </Link>
            <Link
              href="/"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              다시 분석하기
            </Link>
          </div>
        </div>

        <section className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="p-6 md:p-10">
              <div className="text-xs uppercase tracking-[0.24em] text-purple-300/80">
                Core reading
              </div>
              <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">
                {fortune.user.category === "compatibility"
                  ? "관계 흐름의 핵심"
                  : "지금 가장 중요한 흐름"}
              </h2>
              <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-8 text-gray-200">
                {safeNormalizedText(
                  summary?.coreMessage,
                  "현재 흐름과 기본 구조를 종합해 현실적인 방향성을 정리했습니다.",
                )}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {heroChips.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-gray-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-6 lg:border-l lg:border-t-0 md:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <InfoCard
                  label="나를 대표하는 기운"
                  value={formatStem(analysis?.saju?.dayStem)}
                  sub={getDayStemMeaning(analysis?.saju?.dayStem)}
                  tone="highlight"
                />
                <InfoCard
                  label="기운의 기본 세기"
                  value={formatStrengthWithTerm(analysis?.strength?.strength)}
                />
                <InfoCard
                  label="가장 필요한 기운"
                  value={normalizeGanjiText(analysis?.yongsin?.yongsin) || "-"}
                  sub="용신"
                />
                <InfoCard
                  label="올해 흐름 해석"
                  value={safeNormalizedText(
                    summary?.currentSeWoonRelation,
                    safeText(analysis?.sewoonDetail?.relation),
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 grid grid-cols-1 gap-10 xl:grid-cols-[1.5fr_0.85fr]">
          <div className="space-y-10">
            <section>
              <SectionTitle
                eyebrow="Overview"
                title="핵심 정보"
                description="가장 자주 참고하게 되는 핵심 항목만 먼저 정리했습니다."
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoCard
                  label="현재 10년 흐름"
                  value={formatPillar(analysis?.daewoon?.daewoon)}
                  sub="대운"
                />
                <InfoCard
                  label="올해 흐름"
                  value={formatPillar(analysis?.sewoonDetail?.pillar)}
                  sub="세운"
                />
                <InfoCard
                  label="도움 되는 기운"
                  value={normalizeGanjiText(analysis?.yongsin?.heesin) || "-"}
                  sub="희신"
                />
                <InfoCard
                  label="과하면 부담되는 기운"
                  value={normalizeGanjiText(analysis?.yongsin?.gisin) || "-"}
                  sub="기신"
                />
              </div>
            </section>

            {reasoningList.length ? (
              <section>
                <SectionTitle
                  eyebrow="Reasoning"
                  title="이렇게 해석한 이유"
                  description="결과를 그냥 보여주는 것이 아니라, 어떤 기준으로 읽었는지 함께 정리했습니다."
                />

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
                  <div className="space-y-4">
                    {reasoningList.map((item, index) => (
                      <div key={`${item}-${index}`} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-purple-400/20 bg-purple-500/10 text-sm font-semibold text-purple-200">
                            {index + 1}
                          </div>
                          {index !== reasoningList.length - 1 ? (
                            <div className="mt-2 h-full w-px bg-white/10" />
                          ) : null}
                        </div>
                        <div className="pb-6 pt-1 text-sm leading-7 text-gray-300 md:text-[15px]">
                          {item}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {fortune.user.category === "compatibility" && compatibility ? (
              <section>
                <SectionTitle
                  eyebrow="Compatibility"
                  title="궁합 요약"
                  description="좋은 점과 조율 포인트를 한눈에 보기 쉽게 정리했습니다."
                />

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InfoCard
                      label="궁합 점수"
                      value={`${compatibility.score}점`}
                      tone="highlight"
                    />
                    <InfoCard label="등급" value={compatibility.grade} />
                    <InfoCard
                      label="상대 기본 기운"
                      value={formatPillar(partnerAnalysis?.saju?.day)}
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                      <div className="mb-3 text-sm font-semibold text-purple-200">
                        잘 맞는 지점
                      </div>
                      <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-gray-300">
                        {compatibility.strengths.map(
                          (item: string, index: number) => (
                            <li key={`${item}-${index}`}>
                              {normalizeGanjiText(item)}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                      <div className="mb-3 text-sm font-semibold text-amber-200">
                        조율 포인트
                      </div>
                      <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-gray-300">
                        {compatibility.cautions.map(
                          (item: string, index: number) => (
                            <li key={`${item}-${index}`}>
                              {normalizeGanjiText(item)}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-8 text-gray-300">
                    {normalizeGanjiText(compatibility.summary)}
                  </p>

                  {compatibilityEvidenceList.length ? (
                    <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                      <div className="mb-3 text-sm font-semibold text-gray-200">
                        궁합 판단 근거
                      </div>
                      <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-gray-300">
                        {compatibilityEvidenceList.map((item, index) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            <section>
              <SectionTitle
                eyebrow="Structure"
                title="타고난 기본 구조"
                description="년주, 월주, 일주, 시주를 어렵지 않게 이해할 수 있도록 풀어썼습니다."
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "태어난 해의 기운",
                    sub: "년주",
                    pillar: formatPillarFromParts(
                      analysis?.saju?.yearStem,
                      analysis?.saju?.yearBranch,
                    ),
                  },
                  {
                    label: "성장 환경의 기운",
                    sub: "월주",
                    pillar: formatPillarFromParts(
                      analysis?.saju?.monthStem,
                      analysis?.saju?.monthBranch,
                    ),
                  },
                  {
                    label: "나 자신 중심 기운",
                    sub: "일주",
                    pillar: formatPillarFromParts(
                      analysis?.saju?.dayStem,
                      analysis?.saju?.dayBranch,
                    ),
                  },
                  {
                    label: "시간대의 기운",
                    sub: "시주",
                    pillar: formatPillarFromParts(
                      analysis?.saju?.hourStem,
                      analysis?.saju?.hourBranch,
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="text-xs text-gray-400">{item.sub}</div>
                    <div className="mt-2 text-sm font-medium text-gray-200">
                      {item.label}
                    </div>
                    <div className="mt-4 text-sm leading-7 text-white">
                      {item.pillar}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle
                eyebrow="Flow"
                title="현재 흐름과 근거"
                description="10년 흐름과 올해 흐름을 함께 보고, 왜 그렇게 해석했는지 근거를 정리했습니다."
              />

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                  <div className="mb-4 text-lg font-semibold text-white">
                    10년 흐름 계산 기준
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl bg-white/[0.04] p-4">
                      <div className="text-xs text-gray-400">기준 절기</div>
                      <div className="mt-1 text-sm text-gray-200">
                        {safeText(analysis?.daewoon?.basisSolarTerm)} ·{" "}
                        {safeText(analysis?.daewoon?.basisDate)}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/[0.04] p-4">
                      <div className="text-xs text-gray-400">흐름 방향</div>
                      <div className="mt-1 text-sm text-gray-200">
                        {formatFlowDirection(analysis?.daewoon?.direction)}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/[0.04] p-4">
                      <div className="text-xs text-gray-400">시작 나이</div>
                      <div className="mt-1 text-sm text-gray-200">
                        {toNumber(analysis?.daewoon?.startAge, 0)}세
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/[0.04] p-4">
                      <div className="text-xs text-gray-400">현재 구간</div>
                      <div className="mt-1 text-sm text-gray-200">
                        {toNumber(analysis?.daewoon?.currentStartAge, 0)}세 ~{" "}
                        {toNumber(analysis?.daewoon?.currentEndAge, 0)}세
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-8 text-gray-400">
                    {normalizeGanjiText(
                      analysis?.daewoon?.note ??
                        "10년 흐름 기준 설명이 없습니다.",
                    )}
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                  <div className="mb-4 text-lg font-semibold text-white">
                    올해 흐름을 이렇게 본 이유
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/[0.04] p-4">
                      <div className="text-xs text-gray-400">
                        올해 하늘 기운
                      </div>
                      <div className="mt-2 text-sm leading-7 text-gray-200">
                        {formatStem(analysis?.sewoonDetail?.stem)} ·{" "}
                        {safeText(analysis?.sewoonDetail?.stemElement)}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/[0.04] p-4">
                      <div className="text-xs text-gray-400">올해 땅 기운</div>
                      <div className="mt-2 text-sm leading-7 text-gray-200">
                        {formatBranch(analysis?.sewoonDetail?.branch)} ·{" "}
                        {safeText(analysis?.sewoonDetail?.branchElement)}
                      </div>
                    </div>
                  </div>

                  <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-7 text-gray-300">
                    {sewoonEvidenceList.length ? (
                      sewoonEvidenceList.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))
                    ) : (
                      <li>올해 흐름 근거 데이터가 없습니다.</li>
                    )}
                  </ul>

                  <p className="mt-5 text-sm leading-8 text-gray-400">
                    {normalizeGanjiText(analysis?.sewoonDetail?.note)}
                  </p>
                </div>
              </div>

              {relationHighlights.length ? (
                <div className="mt-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                  <div className="mb-3 text-sm font-semibold text-gray-200">
                    관계와 변화 포인트
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {relationHighlights.map((item, index) => (
                      <span
                        key={`${item}-${index}`}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-gray-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-8 text-gray-400">
                    {normalizeGanjiText(
                      analysis?.relations?.summary ??
                        "특별한 변화 포인트는 크지 않습니다.",
                    )}
                  </p>
                </div>
              ) : null}
            </section>

            <section>
              <SectionTitle
                eyebrow="Monthly"
                title="월별 포인트"
                description="좋은 흐름의 달과 주의가 필요한 달을 분리해서 볼 수 있게 구성했습니다."
              />

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="rounded-[2rem] border border-purple-400/15 bg-purple-500/[0.06] p-6">
                  <div className="mb-4 text-lg font-semibold text-purple-100">
                    좋은 흐름의 달
                  </div>
                  <div className="space-y-3">
                    {goodMonths.length ? (
                      goodMonths.map((item) => (
                        <div
                          key={`${item.month}-${item.pillar}`}
                          className="rounded-2xl border border-white/10 bg-black/20 p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <div className="font-medium text-white">
                                {item.month}월
                              </div>
                              <div className="mt-1 text-xs leading-6 text-gray-400">
                                {formatPillar(item.pillar)}
                              </div>
                            </div>
                            <div className="rounded-full bg-purple-500/15 px-3 py-1 text-sm font-semibold text-purple-100">
                              {item.score}점
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">데이터 없음</div>
                    )}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-red-400/15 bg-red-500/[0.04] p-6">
                  <div className="mb-4 text-lg font-semibold text-red-100">
                    주의가 필요한 달
                  </div>
                  <div className="space-y-3">
                    {cautionMonths.length ? (
                      cautionMonths.map((item) => (
                        <div
                          key={`${item.month}-${item.pillar}`}
                          className="rounded-2xl border border-white/10 bg-black/20 p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <div className="font-medium text-white">
                                {item.month}월
                              </div>
                              <div className="mt-1 text-xs leading-6 text-gray-400">
                                {formatPillar(item.pillar)}
                              </div>
                            </div>
                            <div className="rounded-full bg-red-500/15 px-3 py-1 text-sm font-semibold text-red-100">
                              {item.score}점
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">데이터 없음</div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <SectionTitle
                eyebrow="Report"
                title="AI 해석 리포트"
                description="조금 더 자세한 설명이 필요할 때 아래 리포트를 천천히 읽어보면 됩니다."
              />

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <h2 className="mb-4 mt-10 text-2xl font-semibold text-white first:mt-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-3 mt-8 text-xl font-semibold text-white">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="my-3 text-[15px] leading-8 text-gray-300">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-4 list-disc pl-5 text-[15px] leading-8 text-gray-300">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-4 list-decimal pl-5 text-[15px] leading-8 text-gray-300">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="my-1">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-semibold text-white">
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {normalizeReportMarkdown(normalizeGanjiText(fortune.result))}
                </ReactMarkdown>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 xl:sticky xl:top-6">
              <SectionTitle
                eyebrow="Quick glance"
                title="빠른 체크"
                description="긴 설명을 다 읽기 전에 핵심만 빠르게 확인할 수 있습니다."
              />

              <div className="space-y-4">
                <InfoCard
                  label="오행 균형"
                  value={
                    summary?.balance
                      ? `${formatBalanceLevel(summary.balance.level)}`
                      : "-"
                  }
                  sub={
                    summary?.balance
                      ? `편차 ${toNumber(summary.balance.gap, 0)}`
                      : undefined
                  }
                />

                <InfoCard
                  label="올해 흐름 점수"
                  value={`${toNumber(analysis?.sewoonDetail?.score, 0)}점`}
                />

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-xs text-gray-400">두드러지는 성향</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.isArray(analysis?.tenGods?.dominant) &&
                    analysis.tenGods.dominant.length ? (
                      analysis.tenGods.dominant.map((item: string) => (
                        <span
                          key={item}
                          title={getTenGodLabel(item)}
                          className="rounded-full bg-purple-500/15 px-3 py-1.5 text-sm text-purple-100"
                        >
                          {getTenGodMeaning(item)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">데이터 없음</span>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-xs text-gray-400">
                    상대적으로 약한 성향
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.isArray(analysis?.tenGods?.weak) &&
                    analysis.tenGods.weak.length ? (
                      analysis.tenGods.weak.map((item: string) => (
                        <span
                          key={item}
                          title={getTenGodLabel(item)}
                          className="rounded-full bg-white/[0.08] px-3 py-1.5 text-sm text-gray-200"
                        >
                          {getTenGodMeaning(item)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">데이터 없음</span>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-xs text-gray-400">올해 키워드</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.isArray(analysis?.sewoonDetail?.keywords) &&
                    analysis.sewoonDetail.keywords.length ? (
                      analysis.sewoonDetail.keywords.map((item: string) => (
                        <span
                          key={item}
                          className="rounded-full bg-white/[0.08] px-3 py-1.5 text-sm text-gray-200"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">데이터 없음</span>
                    )}
                  </div>
                </div>

                <InfoCard
                  label="분석 기준"
                  value={`${fortune.user.birthDate} ${fortune.user.birthTime || "시간 미상"}`}
                />

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-xs text-gray-400">질문</div>
                  <p className="mt-3 text-sm leading-7 text-gray-300">
                    {safeText(fortune.user.question, "질문 없음")}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

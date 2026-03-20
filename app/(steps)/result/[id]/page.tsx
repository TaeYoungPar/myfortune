"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import ReactMarkdown from "react-markdown";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { TEN_GOD_LABELS } from "@/lib/saju/stemsBranches";

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
  strong: "신강",
  weak: "신약",
};

const elementLabelMap = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

function safeText(value: unknown, fallback = "-") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function getTenGodLabel(value: unknown) {
  if (typeof value !== "string") return "-";
  return TEN_GOD_LABELS[value as keyof typeof TEN_GOD_LABELS] ?? value;
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

  const heroKeywords = useMemo(() => {
    const keywords = [
      safeText(summary?.yongsin, ""),
      safeText(summary?.currentDaewoon, ""),
      safeText(summary?.currentSeWoon, ""),
      safeText(summary?.currentSeWoonRelation, ""),
    ].filter((item) => item && item !== "-");

    return [...new Set(keywords)].slice(0, 4);
  }, [summary]);

  if (!fortune) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
          <p className="text-gray-300">결과를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-200 mb-3">
              {categoryLabel}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {fortune.user.category === "compatibility" && fortune.user.partner
                ? `${safeText(fortune.user.name)}님 · ${safeText(
                    fortune.user.partner.name,
                  )}님 궁합 결과`
                : `${safeText(fortune.user.name)}님의 분석 결과`}
            </h1>

            <p className="text-gray-400 max-w-2xl leading-relaxed">
              {safeText(
                analysis?.strength?.summary,
                "사주 원국과 운의 흐름을 기반으로 핵심 결과를 정리했습니다.",
              )}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm font-medium text-gray-200"
            >
              홈으로
            </Link>
            <Link
              href="/"
              className="rounded-2xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(147,51,234,0.25)]"
            >
              다시 분석하기
            </Link>
          </div>
        </div>

        <section className="mb-6 rounded-[2rem] border border-purple-400/20 bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-white/5 backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_70px_rgba(88,28,135,0.2)]">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-purple-100 mb-4">
                이번 결과의 결론
              </div>

              <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
                {fortune.user.category === "compatibility"
                  ? `${safeText(fortune.user.name)}님과 ${safeText(
                      fortune.user.partner?.name,
                    )}님의 관계 흐름 핵심`
                  : `${categoryLabel} 중심 핵심 해석`}
              </h2>

              <p className="text-sm md:text-base leading-8 text-gray-200 whitespace-pre-line">
                {safeText(
                  summary?.coreMessage,
                  "현재 흐름과 사주 구조를 종합해 현실적인 방향성을 정리했습니다.",
                )}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {heroKeywords.length ? (
                  heroKeywords.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-purple-300/20 bg-purple-500/15 px-3 py-1 text-sm text-purple-100"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-gray-300">
                    핵심 흐름 정리
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-gray-400 mb-1">현재 카테고리</div>
                <div className="text-lg font-bold">{categoryLabel}</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-gray-400 mb-1">일간 상태</div>
                <div className="text-lg font-bold">
                  {strengthLabelMap[analysis?.strength?.strength ?? ""] ?? "-"}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-gray-400 mb-1">핵심 용신</div>
                <div className="text-lg font-bold">
                  {safeText(
                    summary?.yongsin,
                    safeText(analysis?.yongsin?.yongsin),
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-gray-400 mb-1">현재 흐름</div>
                <div className="text-lg font-bold">
                  {safeText(
                    summary?.currentSeWoonRelation,
                    safeText(analysis?.sewoonDetail?.relation),
                  )}
                </div>
              </div>

              <div className="col-span-2 rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-gray-400 mb-2">
                  지금 가장 먼저 볼 포인트
                </div>
                <div className="flex flex-wrap gap-2">
                  {goodMonths.length ? (
                    goodMonths.slice(0, 2).map((item) => (
                      <span
                        key={`${item.month}-${item.pillar}`}
                        className="rounded-full bg-purple-500/15 px-3 py-1 text-sm text-purple-100"
                      >
                        {item.month}월 · {item.pillar} · {item.score}점
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-300">
                      월운 데이터 준비 중
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-5">핵심 요약</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">일간</div>
                  <div className="text-lg font-semibold">
                    {safeText(analysis?.saju?.dayStem)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">일간 상태</div>
                  <div className="text-lg font-semibold">
                    {strengthLabelMap[analysis?.strength?.strength ?? ""] ??
                      "-"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">용신</div>
                  <div className="text-lg font-semibold">
                    {safeText(analysis?.yongsin?.yongsin)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">현재 대운</div>
                  <div className="text-lg font-semibold">
                    {safeText(analysis?.daewoon?.daewoon)}
                  </div>
                </div>
              </div>
            </section>

            {fortune.user.category === "compatibility" && compatibility ? (
              <section className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-5">궁합 핵심 요약</h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-5">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs text-gray-500 mb-1">궁합 점수</div>
                    <div className="text-2xl font-bold">
                      {compatibility.score}점
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs text-gray-500 mb-1">등급</div>
                    <div className="text-2xl font-bold">
                      {compatibility.grade}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs text-gray-500 mb-1">상대 일주</div>
                    <div className="text-2xl font-bold tracking-wider">
                      {safeText(partnerAnalysis?.saju?.day, "-")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <div className="text-sm font-semibold mb-3 text-purple-200">
                      잘 맞는 지점
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
                      {compatibility.strengths.map(
                        (item: string, index: number) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <div className="text-sm font-semibold mb-3 text-amber-200">
                      조율 포인트
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
                      {compatibility.cautions.map(
                        (item: string, index: number) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-gray-300">
                  {compatibility.summary}
                </p>
              </section>
            ) : null}

            <section className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-5">사주 원국</h2>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  {
                    label: "년주",
                    pillar: `${safeText(analysis?.saju?.yearStem, "")}${safeText(
                      analysis?.saju?.yearBranch,
                      "",
                    )}`,
                  },
                  {
                    label: "월주",
                    pillar: `${safeText(analysis?.saju?.monthStem, "")}${safeText(
                      analysis?.saju?.monthBranch,
                      "",
                    )}`,
                  },
                  {
                    label: "일주",
                    pillar: `${safeText(analysis?.saju?.dayStem, "")}${safeText(
                      analysis?.saju?.dayBranch,
                      "",
                    )}`,
                  },
                  {
                    label: "시주",
                    pillar: `${safeText(analysis?.saju?.hourStem, "")}${safeText(
                      analysis?.saju?.hourBranch,
                      "",
                    )}`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center"
                  >
                    <div className="text-xs text-gray-500 mb-3">
                      {item.label}
                    </div>
                    <div className="text-2xl font-bold tracking-wider">
                      {item.pillar || "-"}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-5">오행 분석</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                {[
                  {
                    key: "wood",
                    label: "목",
                    value: Number(analysis?.elements?.wood ?? 0),
                  },
                  {
                    key: "fire",
                    label: "화",
                    value: Number(analysis?.elements?.fire ?? 0),
                  },
                  {
                    key: "earth",
                    label: "토",
                    value: Number(analysis?.elements?.earth ?? 0),
                  },
                  {
                    key: "metal",
                    label: "금",
                    value: Number(analysis?.elements?.metal ?? 0),
                  },
                  {
                    key: "water",
                    label: "수",
                    value: Number(analysis?.elements?.water ?? 0),
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="text-xs text-gray-500 mb-2">
                      {item.label}
                    </div>
                    <div className="text-2xl font-bold mb-3">{item.value}</div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{ width: `${Math.min(item.value * 20, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-gray-400 mb-2">강한 오행</div>
                  <div className="flex flex-wrap gap-2">
                    {dominantElements.length ? (
                      dominantElements.map((item) => (
                        <span
                          key={item.key}
                          className="rounded-full bg-purple-500/15 px-3 py-1 text-sm text-purple-200"
                        >
                          {item.label} ({item.value})
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">데이터 없음</span>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-gray-400 mb-2">보완 포인트</div>
                  <div className="flex flex-wrap gap-2">
                    {lackingElements.length ? (
                      lackingElements.map((item) => (
                        <span
                          key={item.key}
                          className="rounded-full bg-white/10 px-3 py-1 text-sm text-gray-200"
                        >
                          {item.label} ({item.value})
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">데이터 없음</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-5">현재 흐름</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">현재 대운</div>
                  <div className="text-xl font-bold">
                    {safeText(analysis?.daewoon?.daewoon)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">현재 세운</div>
                  <div className="text-xl font-bold">
                    {safeText(analysis?.sewoonDetail?.pillar)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">세운 관계</div>
                  <div className="text-xl font-bold">
                    {safeText(analysis?.sewoonDetail?.relation)}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-gray-400 mb-3">관계 포인트</div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {safeText(
                    analysis?.relations?.summary,
                    "특별한 관계 포인트가 없습니다.",
                  )}
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-5">월별 포인트</h2>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-base font-semibold mb-3 text-purple-200">
                    좋은 흐름의 달
                  </div>
                  <div className="space-y-3">
                    {goodMonths.length ? (
                      goodMonths.map((item) => (
                        <div
                          key={`${item.month}-${item.pillar}`}
                          className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                        >
                          <div>
                            <div className="font-medium">{item.month}월</div>
                            <div className="text-xs text-gray-500">
                              {item.pillar}
                            </div>
                          </div>
                          <div className="text-sm text-purple-200 font-semibold">
                            {item.score}점
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">데이터 없음</div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-base font-semibold mb-3 text-red-200">
                    주의가 필요한 달
                  </div>
                  <div className="space-y-3">
                    {cautionMonths.length ? (
                      cautionMonths.map((item) => (
                        <div
                          key={`${item.month}-${item.pillar}`}
                          className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                        >
                          <div>
                            <div className="font-medium">{item.month}월</div>
                            <div className="text-xs text-gray-500">
                              {item.pillar}
                            </div>
                          </div>
                          <div className="text-sm text-red-200 font-semibold">
                            {item.score}점
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">데이터 없음</div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-5">AI 해석 리포트</h2>

              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold mt-8 mb-4 text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold mt-6 mb-3 text-white">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-300 leading-8 my-3">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 my-4 text-gray-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 my-4 text-gray-300">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="my-1">{children}</li>,
                  strong: ({ children }) => (
                    <strong className="text-white font-semibold">
                      {children}
                    </strong>
                  ),
                }}
              >
                {normalizeReportMarkdown(fortune.result)}
              </ReactMarkdown>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-5">빠른 체크</h2>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">희신</div>
                  <div className="text-lg font-semibold">
                    {safeText(analysis?.yongsin?.heesin)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">기신</div>
                  <div className="text-lg font-semibold">
                    {safeText(analysis?.yongsin?.gisin)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-2">강한 십성</div>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(analysis?.tenGods?.dominant) &&
                    analysis.tenGods.dominant.length ? (
                      analysis.tenGods.dominant.map((item: string) => (
                        <span
                          key={item}
                          className="rounded-full bg-purple-500/15 px-3 py-1 text-sm text-purple-200"
                        >
                          {getTenGodLabel(item)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">데이터 없음</span>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-2">약한 십성</div>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(analysis?.tenGods?.weak) &&
                    analysis.tenGods.weak.length ? (
                      analysis.tenGods.weak.map((item: string) => (
                        <span
                          key={item}
                          className="rounded-full bg-white/10 px-3 py-1 text-sm text-gray-200"
                        >
                          {getTenGodLabel(item)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">데이터 없음</span>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">질문</div>
                  <div className="text-sm leading-relaxed text-gray-300">
                    {safeText(fortune.user.question, "질문 없음")}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">분석 기준</div>
                  <div className="text-sm leading-relaxed text-gray-300">
                    {fortune.user.birthDate}{" "}
                    {fortune.user.birthTime || "시간 미상"}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

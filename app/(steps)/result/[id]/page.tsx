"use client";

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
  crush: "짝사랑 흐름",
  contact: "연락운",
  compatibility: "궁합 분석",
  money: "재물운",
  career: "직장운",
  business: "사업운",
  year: "올해 운세",
  life: "인생 방향",
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

const strengthLabelMap: Record<string, string> = {
  strong: "기운이 강한 편",
  weak: "기운이 섬세한 편",
};

const balanceLabelMap: Record<string, string> = {
  balanced: "균형이 좋은 편",
  slightly_unbalanced: "약간 치우친 편",
  unbalanced: "한쪽으로 치우친 편",
};

const elementLabelMap: Record<string, string> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

function safeText(value: unknown, fallback = "-") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function toNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizeGanjiText(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "";
  return value
    .split("")
    .map(
      (char) =>
        chineseStemToKoreanMap[char] || chineseBranchToKoreanMap[char] || char,
    )
    .join("");
}

function safeNormalizedText(value: unknown, fallback = "-") {
  return normalizeGanjiText(safeText(value, fallback));
}

function formatPillar(value: unknown) {
  const normalized = normalizeGanjiText(value);
  if (!normalized) return "-";
  return normalized;
}

function formatElementList(values: unknown) {
  const list = toArray(values).map(normalizeGanjiText).filter(Boolean);
  if (!list.length) return "특별히 두드러진 요소 없음";
  return list.join(", ");
}

function formatTenGodList(values: unknown) {
  const list = toArray(values);
  if (!list.length) return "두드러진 요소 없음";
  return list
    .map((item) => TEN_GOD_LABELS[item as keyof typeof TEN_GOD_LABELS] ?? item)
    .map(normalizeGanjiText)
    .join(", ");
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
  badge,
  title,
  description,
}: {
  badge?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      {badge ? (
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
          {badge}
        </div>
      ) : null}
      <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function Card({
  title,
  value,
  description,
  highlight = false,
}: {
  title: string;
  value: string;
  description?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-5",
        highlight
          ? "border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-slate-900/60"
          : "border-white/10 bg-white/[0.04]",
      ].join(" ")}
    >
      <div className="text-xs text-slate-400">{title}</div>
      <div className="mt-3 text-lg font-semibold leading-relaxed text-white">
        {value}
      </div>
      {description ? (
        <div className="mt-2 text-sm leading-6 text-slate-400">
          {description}
        </div>
      ) : null}
    </div>
  );
}

export default function ResultPage() {
  const params = useParams();
  const id =
    typeof params.id === "string" ? (params.id as Id<"fortunes">) : undefined;

  const fortune = useQuery(api.fortunes.getFortune, id ? { id } : "skip");

  if (fortune === undefined) {
    return (
      <div className="min-h-screen bg-[#09090f] px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-10 w-48 rounded-full bg-white/10" />
          <div className="mt-6 h-32 rounded-3xl bg-white/10" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="h-32 rounded-3xl bg-white/10" />
            <div className="h-32 rounded-3xl bg-white/10" />
            <div className="h-32 rounded-3xl bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!fortune) {
    return (
      <div className="min-h-screen bg-[#09090f] px-4 py-20 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <h1 className="text-2xl font-bold">결과를 찾을 수 없어요</h1>
          <p className="mt-3 text-slate-400">
            분석 결과가 없거나 잘못된 주소예요.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-2xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-500"
          >
            다시 분석하러 가기
          </Link>
        </div>
      </div>
    );
  }

  const analysis = fortune.analysis as Record<string, any>;
  const summary = analysis?.summary ?? {};
  const saju = analysis?.saju ?? {};
  const strength = analysis?.strength ?? {};
  const yongsin = analysis?.yongsin ?? {};
  const sewoonDetail = analysis?.sewoonDetail ?? {};
  const daewoon = analysis?.daewoon ?? {};

  const categoryLabel =
    categoryLabelMap[fortune.user?.category ?? ""] ?? "운세";

  const resultMarkdown = normalizeReportMarkdown(
    normalizeGanjiText(fortune.result ?? ""),
  );

  const normalizedDayMaster = normalizeGanjiText(summary.dayMaster);
  const dayMaster = formatPillar(summary.dayMaster);
  const dayElement = safeNormalizedText(summary.dayElement);
  const strengthText =
    strengthLabelMap[safeText(summary.strength)] ??
    safeNormalizedText(summary.strength);
  const balanceText =
    balanceLabelMap[safeText(summary.balance?.level)] ??
    safeNormalizedText(summary.balance?.level);

  const dominantElements = formatElementList(summary.dominantElements);
  const lackingElements = formatElementList(summary.lackingElements);
  const currentDaewoon = formatPillar(summary.currentDaewoon);
  const currentSeWoon = formatPillar(summary.currentSeWoon);
  const currentSeWoonRelation = safeNormalizedText(
    summary.currentSeWoonRelation,
  );

  const relationHighlights = toArray(summary.relationHighlights).map(
    normalizeGanjiText,
  );

  const goodMonths = Array.isArray(summary.goodMonths)
    ? summary.goodMonths
    : [];
  const cautionMonths = Array.isArray(summary.cautionMonths)
    ? summary.cautionMonths
    : [];

  const coreMessage = safeNormalizedText(
    summary.coreMessage,
    "지금 흐름을 차분히 정리해볼 시기예요.",
  );

  return (
    <div className="min-h-screen bg-[#09090f] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
          >
            ← 다시 보기
          </Link>
          <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
            {categoryLabel}
          </div>
        </div>

        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-500/15 via-[#10101b] to-[#0b0b12] p-6 sm:p-8">
          <div className="max-w-3xl">
            <div className="text-sm text-violet-200">
              {safeText(fortune.user?.name, "당신")}님의 분석 결과
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              지금 흐름의 핵심을 먼저 정리해드릴게요
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              {coreMessage}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Card
                title="일간"
                value={`${dayMaster} · ${dayElement}`}
                description={
                  stemMeaningMap[normalizedDayMaster] ?? "타고난 중심 기운"
                }
                highlight
              />
              <Card
                title="기운 상태"
                value={strengthText}
                description={`전체 균형은 ${balanceText}입니다.`}
              />
              <Card
                title="현재 큰 흐름"
                value={`${currentDaewoon} 대운 / ${currentSeWoon} 세운`}
                description={currentSeWoonRelation}
              />
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <SectionTitle
            badge="핵심 요약"
            title="내 사주의 큰 그림"
            description="처음 보는 사람도 이해할 수 있게 쉬운 말로 정리한 핵심입니다."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card
              title="강한 오행"
              value={dominantElements}
              description="자연스럽게 힘이 실리는 성향입니다."
            />
            <Card
              title="보완이 필요한 오행"
              value={lackingElements}
              description="생활 습관이나 선택에서 의식하면 도움이 됩니다."
            />
            <Card
              title="용신"
              value={safeNormalizedText(yongsin.yongsin)}
              description="삶의 균형을 잡는 데 도움 되는 핵심 기운입니다."
            />
            <Card
              title="희신"
              value={safeNormalizedText(yongsin.heesin)}
              description="용신을 도와주는 보조 흐름입니다."
            />
          </div>
        </section>

        <section className="mt-12 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <SectionTitle
              badge="사주 원국"
              title="기본 구조"
              description="태어난 시점의 기본 기운입니다."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Card title="년주" value={formatPillar(saju.year)} />
              <Card title="월주" value={formatPillar(saju.month)} />
              <Card title="일주" value={formatPillar(saju.day)} />
              <Card title="시주" value={formatPillar(saju.hour)} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Card
                title="신강 / 신약"
                value={strengthText}
                description={safeNormalizedText(strength.summary)}
              />
              <Card
                title="십성 요약"
                value={formatTenGodList(analysis?.summary?.dominantTenGods)}
                description="삶에서 자주 드러나는 역할 성향입니다."
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <SectionTitle
              badge="시기 흐름"
              title="지금과 올해의 포인트"
              description="언제 밀고, 언제 조심할지 가볍게 확인해보세요."
            />

            <div className="grid gap-4">
              <Card
                title="현재 대운"
                value={formatPillar(daewoon.daewoon)}
                description={`현재 나이 ${toNumber(daewoon.currentAge)}세 · ${
                  daewoon.direction === "forward" ? "순행" : "역행"
                }`}
                highlight
              />
              <Card
                title="올해 세운"
                value={formatPillar(sewoonDetail.pillar)}
                description={`${safeNormalizedText(sewoonDetail.relation)} · ${toNumber(
                  sewoonDetail.score,
                )}점`}
              />
              <Card
                title="올해 키워드"
                value={
                  toArray(sewoonDetail.keywords)
                    .map(normalizeGanjiText)
                    .join(", ") || "-"
                }
                description={safeNormalizedText(sewoonDetail.note)}
              />
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <SectionTitle
            badge="월별 포인트"
            title="좋은 달과 조심할 달"
            description="전체 운이 크게 살아나는 시기와 속도를 조절하면 좋은 시기를 함께 봅니다."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-emerald-400/20 bg-emerald-500/5 p-6">
              <h3 className="text-lg font-semibold text-white">
                좋은 흐름이 들어오는 달
              </h3>
              <div className="mt-4 space-y-3">
                {goodMonths.length ? (
                  goodMonths.map((item: any, index: number) => (
                    <div
                      key={`good-${index}`}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="text-sm text-emerald-300">
                        {toNumber(item.month)}월
                      </div>
                      <div className="mt-1 text-base font-semibold text-white">
                        {formatPillar(item.pillar)} · {toNumber(item.score)}점
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-400">
                    데이터가 아직 없어요.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-rose-400/20 bg-rose-500/5 p-6">
              <h3 className="text-lg font-semibold text-white">
                조심하면 좋은 달
              </h3>
              <div className="mt-4 space-y-3">
                {cautionMonths.length ? (
                  cautionMonths.map((item: any, index: number) => (
                    <div
                      key={`caution-${index}`}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="text-sm text-rose-300">
                        {toNumber(item.month)}월
                      </div>
                      <div className="mt-1 text-base font-semibold text-white">
                        {formatPillar(item.pillar)} · {toNumber(item.score)}점
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-400">
                    데이터가 아직 없어요.
                  </div>
                )}
              </div>
            </div>
          </div>

          {relationHighlights.length ? (
            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-lg font-semibold text-white">
                관계 흐름 한눈에 보기
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {relationHighlights.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-2 text-sm text-violet-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-12 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <SectionTitle
            badge="사주 해설"
            title="쉽게 읽는 전체 분석"
            description="사주 용어를 최대한 풀어서 정리한 해설입니다."
          />

          <article
            className="
      max-w-none
      text-[15px] leading-8 text-slate-300
      [&>*:first-child]:mt-0
      [&>*:last-child]:mb-0
      [&_h1]:mt-0
      [&_h1]:mb-5
      [&_h1]:text-3xl
      [&_h1]:font-bold
      [&_h1]:tracking-tight
      [&_h1]:text-white
      [&_h2]:mt-12
      [&_h2]:mb-5
      [&_h2]:border-b
      [&_h2]:border-white/10
      [&_h2]:pb-3
      [&_h2]:text-2xl
      [&_h2]:font-bold
      [&_h2]:tracking-tight
      [&_h2]:text-white
      [&_h3]:mt-8
      [&_h3]:mb-3
      [&_h3]:text-xl
      [&_h3]:font-semibold
      [&_h3]:text-white
      [&_h4]:mt-6
      [&_h4]:mb-2
      [&_h4]:text-lg
      [&_h4]:font-semibold
      [&_h4]:text-white
      [&_p]:my-4
      [&_p]:leading-8
      [&_p]:text-slate-300
      [&_strong]:font-semibold
      [&_strong]:text-white
      [&_ul]:my-5
      [&_ul]:list-disc
      [&_ul]:space-y-2
      [&_ul]:pl-6
      [&_ul]:text-slate-300
      [&_ol]:my-5
      [&_ol]:list-decimal
      [&_ol]:space-y-2
      [&_ol]:pl-6
      [&_ol]:text-slate-300
      [&_li]:pl-1
      [&_blockquote]:my-6
      [&_blockquote]:rounded-2xl
      [&_blockquote]:border
      [&_blockquote]:border-violet-400/20
      [&_blockquote]:bg-violet-500/5
      [&_blockquote]:px-5
      [&_blockquote]:py-4
      [&_blockquote]:text-slate-200
      [&_blockquote]:italic
      [&_hr]:my-8
      [&_hr]:border-white/10
      [&_code]:rounded-md
      [&_code]:bg-white/10
      [&_code]:px-1.5
      [&_code]:py-0.5
      [&_code]:text-[0.95em]
      [&_code]:text-violet-200
      [&_pre]:my-6
      [&_pre]:overflow-x-auto
      [&_pre]:rounded-2xl
      [&_pre]:border
      [&_pre]:border-white/10
      [&_pre]:bg-[#0f1118]
      [&_pre]:p-4
      [&_pre]:text-sm
      [&_pre_code]:bg-transparent
      [&_pre_code]:p-0
      [&_pre_code]:text-slate-200
      [&_a]:text-violet-300
      [&_a]:underline
      [&_a]:underline-offset-4
    "
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1>{children}</h1>,
                h2: ({ children }) => <h2>{children}</h2>,
                h3: ({ children }) => <h3>{children}</h3>,
                h4: ({ children }) => <h4>{children}</h4>,
                p: ({ children }) => <p>{children}</p>,
                ul: ({ children }) => <ul>{children}</ul>,
                ol: ({ children }) => <ol>{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote>{children}</blockquote>
                ),
                hr: () => <hr />,
                a: ({ href, children }) => <a href={href}>{children}</a>,
                code: ({ inline, children, ...props }: any) =>
                  inline ? (
                    <code {...props}>{children}</code>
                  ) : (
                    <code {...props}>{children}</code>
                  ),
                pre: ({ children }) => <pre>{children}</pre>,
                strong: ({ children }) => <strong>{children}</strong>,
              }}
            >
              {resultMarkdown}
            </ReactMarkdown>
          </article>
        </section>
      </div>
    </div>
  );
}

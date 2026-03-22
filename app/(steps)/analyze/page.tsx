"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, RefreshCcw, Home, Loader2 } from "lucide-react";

import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useFortuneStore } from "@/store/useFortuneStore";

type AnalyzeStatus = "idle" | "loading" | "success" | "error";

const STEP_MESSAGES = [
  "사주 원국을 계산하는 중...",
  "오행의 균형을 분석하는 중...",
  "신강·신약 흐름을 살피는 중...",
  "용신과 핵심 기운을 정리하는 중...",
  "대운과 세운의 흐름을 읽는 중...",
  "결과를 해석하는 중...",
  "결과를 정리하고 있어요...",
];

function getSajuTimeLabel(hour?: string) {
  if (!hour) return "시간 미상";

  const h = Number(hour);

  if (h >= 23 || h < 1) return "자시";
  if (h >= 1 && h < 3) return "축시";
  if (h >= 3 && h < 5) return "인시";
  if (h >= 5 && h < 7) return "묘시";
  if (h >= 7 && h < 9) return "진시";
  if (h >= 9 && h < 11) return "사시";
  if (h >= 11 && h < 13) return "오시";
  if (h >= 13 && h < 15) return "미시";
  if (h >= 15 && h < 17) return "신시";
  if (h >= 17 && h < 19) return "유시";
  if (h >= 19 && h < 21) return "술시";
  if (h >= 21 && h < 23) return "해시";

  return "시간 미상";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function AnalyzePage() {
  const router = useRouter();
  const store = useFortuneStore();

  const generateFortune = useAction(api.openai.generateFortune);

  const [status, setStatus] = useState<AnalyzeStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const startedRef = useRef(false);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isCompatibility = store.category === "compatibility";

  const canAnalyze = useMemo(() => {
    const hasBase =
      !!store.name?.trim() &&
      !!store.birthYear &&
      !!store.birthMonth &&
      !!store.birthDay &&
      !!store.category;

    if (!hasBase) return false;

    if (isCompatibility) {
      return (
        !!store.partnerName?.trim() &&
        !!store.partnerBirthYear &&
        !!store.partnerBirthMonth &&
        !!store.partnerBirthDay
      );
    }

    return true;
  }, [
    store.name,
    store.birthYear,
    store.birthMonth,
    store.birthDay,
    store.category,
    store.partnerName,
    store.partnerBirthYear,
    store.partnerBirthMonth,
    store.partnerBirthDay,
    isCompatibility,
  ]);

  const birthDate = `${store.birthYear}-${store.birthMonth.padStart(2, "0")}-${store.birthDay.padStart(2, "0")}`;

  const partnerBirthDate =
    isCompatibility &&
    store.partnerBirthYear &&
    store.partnerBirthMonth &&
    store.partnerBirthDay
      ? `${store.partnerBirthYear}-${store.partnerBirthMonth.padStart(2, "0")}-${store.partnerBirthDay.padStart(2, "0")}`
      : undefined;

  const defaultQuestionMap: Record<string, string> = {
    love: "현재 연애 흐름과 앞으로 들어올 인연을 분석해주세요.",
    reunion: "헤어진 사람과 재회 가능성과 시기를 분석해주세요.",
    crush: "현재 짝사랑이 이루어질 가능성과 관계 흐름을 분석해주세요.",
    contact: "상대방에게 연락이 올 가능성과 시기를 분석해주세요.",
    compatibility: "두 사람의 궁합과 관계 흐름을 분석해주세요.",
    money: "현재 재물운과 돈의 흐름을 분석해주세요.",
    career: "직장운과 커리어 방향을 분석해주세요.",
    business: "사업운과 성공 가능성을 분석해주세요.",
    year: "올해 전체 운세 흐름을 분석해주세요.",
    life: "인생의 방향과 앞으로의 흐름을 분석해주세요.",
  };

  const resolvedQuestion =
    store.question?.trim() ||
    defaultQuestionMap[store.category] ||
    "전체 운세 흐름을 분석해주세요.";

  const clearTimers = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    progressTimerRef.current = null;
    stepTimerRef.current = null;
  };

  const startFakeProgress = () => {
    clearTimers();

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        if (prev < 30) return prev + 3;
        if (prev < 60) return prev + 2;
        if (prev < 80) return prev + 1;
        return prev + 0.5;
      });
    }, 250);

    stepTimerRef.current = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEP_MESSAGES.length);
    }, 1800);
  };

  const finishProgress = async () => {
    clearTimers();
    setStepIndex(STEP_MESSAGES.length - 1);

    setProgress((prev) => (prev < 95 ? 95 : prev));
    await sleep(250);

    setProgress(100);

    // 100%에서 0.4 ~ 0.8초 머무르기
    const holdMs = 400 + Math.floor(Math.random() * 401);
    await sleep(holdMs);
  };

  const runAnalysis = async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (!canAnalyze) {
      router.replace("/");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setProgress(4);
    setStepIndex(0);

    startFakeProgress();

    try {
      const payload = {
        name: store.name.trim(),
        gender: store.gender,
        calendarType: store.calendarType,
        birthDate,
        birthTime: store.birthTime || "",
        category: store.category,
        question: resolvedQuestion,
        ...(isCompatibility
          ? {
              partner: {
                name: store.partnerName.trim(),
                gender: store.partnerGender,
                calendarType: store.partnerCalendarType,
                birthDate: partnerBirthDate!,
                birthTime: store.partnerBirthTime || "",
              },
            }
          : {}),
      };

      const resultId = await generateFortune(payload);

      await finishProgress();
      setStatus("success");

      if (!resultId) {
        throw new Error("분석 결과 ID를 찾을 수 없습니다.");
      }

      router.replace(`/result/${resultId}`);
    } catch (error) {
      clearTimers();
      setStatus("error");
      setProgress(0);

      const message =
        error instanceof Error
          ? error.message
          : "분석 중 문제가 발생했습니다. 다시 시도해주세요.";

      setErrorMessage(message);
      startedRef.current = false;
    }
  };

  useEffect(() => {
    runAnalysis();

    return () => {
      clearTimers();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[42%] h-[42%] rounded-full bg-purple-900/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[42%] h-[42%] rounded-full bg-indigo-900/20 blur-[130px]" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 shadow-[0_10px_60px_rgba(0,0,0,0.35)]"
        >
          {status !== "error" ? (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-400/20">
                  {status === "success" ? (
                    <Sparkles className="h-6 w-6 text-purple-200" />
                  ) : (
                    <Loader2 className="h-6 w-6 text-purple-200 animate-spin" />
                  )}
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {status === "success"
                      ? "분석 완료"
                      : "AI가 사주를 분석 중입니다"}
                  </h1>
                  <p className="text-sm md:text-base text-gray-400 mt-1">
                    {isCompatibility
                      ? "두 사람의 흐름과 궁합을 함께 정리하고 있어요."
                      : "원국과 운의 흐름을 차근차근 읽고 있어요."}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">분석 진행도</span>
                  <span className="text-sm font-semibold text-purple-200">
                    {Math.round(progress)}%
                  </span>
                </div>

                <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.35 }}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-4 min-h-[28px]">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={stepIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm text-gray-300"
                    >
                      {STEP_MESSAGES[stepIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">이름</div>
                  <div className="text-base font-semibold">
                    {store.name || "-"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">카테고리</div>
                  <div className="text-base font-semibold">
                    {store.category === "love" && "연애운"}
                    {store.category === "reunion" && "재회 가능성"}
                    {store.category === "crush" && "짝사랑 성공률"}
                    {store.category === "contact" && "연락운"}
                    {store.category === "compatibility" && "궁합 분석"}
                    {store.category === "money" && "재물운"}
                    {store.category === "career" && "직장운"}
                    {store.category === "business" && "사업운"}
                    {store.category === "year" && "올해 운세"}
                    {store.category === "life" && "인생 방향"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">출생 정보</div>
                  <div className="text-base font-semibold">
                    {birthDate}{" "}
                    {getSajuTimeLabel(store.birthTime) || "시간 미상"}
                  </div>
                </div>
              </div>

              {isCompatibility ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-gray-500 mb-1">상대 정보</div>
                  <div className="text-base font-semibold">
                    {store.partnerName || "-"} · {partnerBirthDate || "-"}{" "}
                    {getSajuTimeLabel(store.partnerBirthTime) || "시간 미상"}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 border border-red-400/20">
                  <AlertCircle className="h-6 w-6 text-red-300" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    분석에 실패했습니다
                  </h1>
                  <p className="text-sm md:text-base text-gray-400 mt-1">
                    잠시 후 다시 시도해 주세요.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100 leading-7">
                {errorMessage || "알 수 없는 오류가 발생했습니다."}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => runAnalysis()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white"
                >
                  <RefreshCcw className="h-4 w-4" />
                  다시 시도
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm font-medium text-gray-200"
                >
                  <Home className="h-4 w-4" />
                  홈으로 이동
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

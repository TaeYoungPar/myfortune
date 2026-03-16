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
  "AI가 결과를 해석하는 중...",
  "결과를 정리하고 있어요...",
];

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
    await sleep(450);
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
    setProgress(0);
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

  return <div />;
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useFortuneStore } from "@/store/useFortuneStore";

export default function AnalyzePage() {
  const router = useRouter();
  const store = useFortuneStore();

  const generateFortune = useAction(api.openai.generateFortune);

  const steps = [
    "사주 데이터를 분석하는 중...",
    "천간과 지지를 계산하는 중...",
    "운명의 흐름을 해석하는 중...",
    "AI가 당신의 미래를 읽는 중...",
    "결과를 정리하는 중...",
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const [done, setDone] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);

  // step 텍스트 진행
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) return prev;
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(stepTimer);
  }, []);

  // progress 진행
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return p + 2;
      });
    }, 120);

    return () => clearInterval(progressTimer);
  }, []);

  // GPT 분석 실행
  useEffect(() => {
    const run = async () => {
      try {
        const id = await generateFortune({
          name: store.name,
          gender: store.gender,
          birthDate: `${store.birthYear}-${store.birthMonth}-${store.birthDay}`,
          birthTime: store.birthTime,
          category: store.category,
          question: store.question,
        });

        setResultId(id);
        setDone(true);
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, []);

  // progress 완료 + AI 완료 → 결과 페이지 이동
  useEffect(() => {
    if (progress === 100 && done && resultId) {
      setTimeout(() => {
        router.push(`/result/${resultId}`);
      }, 1200);
    }
  }, [progress, done, resultId, router]);

  return (
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="flex justify-center mb-8"
        >
          <Sparkles size={50} className="text-purple-400" />
        </motion.div>

        <h1 className="text-2xl font-bold mb-4">
          AI가 당신의 운명을 분석하고 있습니다
        </h1>

        <p className="text-gray-400 mb-8 h-6">
          {progress === 100 && done
            ? "✨ 당신의 운명이 완성되었습니다"
            : steps[stepIndex]}
        </p>

        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-purple-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-sm text-gray-500">분석 진행률 {progress}%</div>

        {progress === 100 && done && (
          <p className="text-xs text-purple-400 mt-3">
            당신의 사주에서 중요한 변화가 발견되었습니다
          </p>
        )}
      </div>
    </div>
  );
}

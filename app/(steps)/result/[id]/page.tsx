"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
// 1. 라이브러리 임포트
import ReactMarkdown from "react-markdown";

export default function ResultPage() {
  const params = useParams();

  const id =
    typeof params.id === "string" ? (params.id as Id<"fortunes">) : undefined;

  const fortune = useQuery(api.fortunes.getFortune, id ? { id } : "skip");

  if (!fortune) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🔮 AI 운세 분석 결과
        </h1>

        {/* 2. 이 부분을 수정했습니다 */}
        <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed">
          <ReactMarkdown
            components={{
              // 각 문단(p) 사이에 여백을 충분히 줍니다.
              p: ({ children }) => <p className="mb-6 last:mb-0">{children}</p>,
              // 섹션 번호(1️⃣ 등)가 강조될 수 있도록 스타일링 가능합니다.
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mt-8 mb-4 text-purple-300">
                  {children}
                </h1>
              ),
            }}
          >
            {fortune.result}
          </ReactMarkdown>
        </div>

        {/* 하단 결제 유도 부분은 필요할 때 주석을 해제하세요 */}
        {/* <div className="relative mt-8">
          <div className="blur-sm opacity-60 space-y-4 text-gray-300">
            <p>{hidden}</p>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-[#0B0E14]">
            <Lock className="text-purple-400 mb-3" size={30} />

            <p className="text-sm text-gray-400 mb-4">
              전체 운세 분석이 잠겨 있습니다
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-500 transition p-5 rounded-2xl font-bold text-lg shadow-lg"
        >
          전체 운세 보기 (3,900원)
        </motion.button> */}
      </div>
    </div>
  );
}

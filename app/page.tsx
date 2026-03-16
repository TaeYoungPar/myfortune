"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFortuneStore } from "@/store/useFortuneStore";
import { motion } from "framer-motion";
import {
  Clock,
  MessageSquare,
  ChevronRight,
  HeartHandshake,
} from "lucide-react";

type DateParts = {
  year: string;
  month: string;
  day: string;
};

function isValidDate(year: string, month: string, day: string) {
  if (!year || !month || !day) return false;

  const y = Number(year);
  const m = Number(month);
  const d = Number(day);

  if (!y || !m || !d) return false;
  if (year.length !== 4) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;

  const date = new Date(y, m - 1, d);

  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

function formatMonthOrDay(value: string, max: number) {
  let v = value.replace(/\D/g, "").slice(0, 2);
  if (!v) return "";
  if (Number(v) > max) v = String(max);
  return v;
}

function BirthDateInputs({
  year,
  month,
  day,
  setYear,
  setMonth,
  setDay,
}: {
  year: string;
  month: string;
  day: string;
  setYear: (v: string) => void;
  setMonth: (v: string) => void;
  setDay: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <input
        type="text"
        placeholder="YYYY"
        inputMode="numeric"
        maxLength={4}
        value={year}
        onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
        className="bg-black/20 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-purple-500"
      />

      <input
        type="text"
        placeholder="MM"
        inputMode="numeric"
        maxLength={2}
        value={month}
        onChange={(e) => setMonth(formatMonthOrDay(e.target.value, 12))}
        className="bg-black/20 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-purple-500"
      />

      <input
        type="text"
        placeholder="DD"
        inputMode="numeric"
        maxLength={2}
        value={day}
        onChange={(e) => setDay(formatMonthOrDay(e.target.value, 31))}
        className="bg-black/20 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-purple-500"
      />
    </div>
  );
}

function BirthTimeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Clock className="absolute left-4 top-4 text-gray-500" size={18} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/20 border border-white/10 p-4 pl-12 rounded-2xl focus:outline-none focus:border-purple-500 text-gray-300 appearance-none hover:cursor-pointer"
      >
        <option value="" className="bg-[#1a1b2e]">
          태어난 시간 (모름)
        </option>
        <option value="23" className="bg-[#1a1b2e]">
          23:00 ~ 01:00 (자시)
        </option>
        <option value="1" className="bg-[#1a1b2e]">
          01:00 ~ 03:00 (축시)
        </option>
        <option value="3" className="bg-[#1a1b2e]">
          03:00 ~ 05:00 (인시)
        </option>
        <option value="5" className="bg-[#1a1b2e]">
          05:00 ~ 07:00 (묘시)
        </option>
        <option value="7" className="bg-[#1a1b2e]">
          07:00 ~ 09:00 (진시)
        </option>
        <option value="9" className="bg-[#1a1b2e]">
          09:00 ~ 11:00 (사시)
        </option>
        <option value="11" className="bg-[#1a1b2e]">
          11:00 ~ 13:00 (오시)
        </option>
        <option value="13" className="bg-[#1a1b2e]">
          13:00 ~ 15:00 (미시)
        </option>
        <option value="15" className="bg-[#1a1b2e]">
          15:00 ~ 17:00 (신시)
        </option>
        <option value="17" className="bg-[#1a1b2e]">
          17:00 ~ 19:00 (유시)
        </option>
        <option value="19" className="bg-[#1a1b2e]">
          19:00 ~ 21:00 (술시)
        </option>
        <option value="21" className="bg-[#1a1b2e]">
          21:00 ~ 23:00 (해시)
        </option>
      </select>
    </div>
  );
}

function CalendarTypeToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: "solar" | "lunar") => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange("solar")}
        className={`flex-1 p-3 rounded-xl border ${
          value === "solar"
            ? "bg-purple-600 border-purple-500"
            : "bg-black/20 border-white/10"
        }`}
      >
        양력
      </button>

      <button
        type="button"
        onClick={() => onChange("lunar")}
        className={`flex-1 p-3 rounded-xl border ${
          value === "lunar"
            ? "bg-purple-600 border-purple-500"
            : "bg-black/20 border-white/10"
        }`}
      >
        음력
      </button>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const store = useFortuneStore();
  const [error, setError] = useState("");

  const themes = [
    { id: "love", label: "💕 연애운" },
    { id: "reunion", label: "💔 재회 가능성" },
    { id: "crush", label: "💌 짝사랑 성공률" },
    { id: "contact", label: "📱 연락 올까?" },
    { id: "compatibility", label: "💑 궁합 분석" },
    { id: "money", label: "💰 재물운" },
    { id: "career", label: "💼 직장운" },
    { id: "business", label: "🚀 사업운" },
    { id: "year", label: "🔮 올해 운세" },
    { id: "life", label: "🧭 인생 방향" },
  ];

  const categoryQuestions: Record<string, string> = {
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

  const isCompatibility = store.category === "compatibility";

  const myBirthValid = useMemo(
    () => isValidDate(store.birthYear, store.birthMonth, store.birthDay),
    [store.birthYear, store.birthMonth, store.birthDay],
  );

  const partnerBirthValid = useMemo(
    () =>
      isValidDate(
        store.partnerBirthYear,
        store.partnerBirthMonth,
        store.partnerBirthDay,
      ),
    [store.partnerBirthYear, store.partnerBirthMonth, store.partnerBirthDay],
  );

  useEffect(() => {
    if (!store.category) return;

    const preset = categoryQuestions[store.category];
    if (
      !store.question ||
      Object.values(categoryQuestions).includes(store.question)
    ) {
      store.setQuestion(preset);
    }
  }, [store.category]);

  const validateBaseFields = () => {
    if (!store.name.trim()) return "이름을 입력해주세요.";
    if (!store.category) return "운세 테마를 선택해주세요.";
    if (!store.birthYear || !store.birthMonth || !store.birthDay) {
      return "생년월일을 입력해주세요.";
    }
    if (!myBirthValid) return "내 생년월일을 정확히 입력해주세요.";
    return "";
  };

  const validateCompatibilityFields = () => {
    if (!isCompatibility) return "";
    if (!store.partnerName.trim()) return "상대 이름을 입력해주세요.";
    if (
      !store.partnerBirthYear ||
      !store.partnerBirthMonth ||
      !store.partnerBirthDay
    ) {
      return "상대 생년월일을 입력해주세요.";
    }
    if (!partnerBirthValid) return "상대 생년월일을 정확히 입력해주세요.";
    return "";
  };

  const handleSubmit = () => {
    const baseError = validateBaseFields();
    if (baseError) {
      setError(baseError);
      return;
    }

    const compatibilityError = validateCompatibilityFields();
    if (compatibilityError) {
      setError(compatibilityError);
      return;
    }

    setError("");

    if (!store.question.trim()) {
      store.setQuestion(categoryQuestions[store.category]);
    }

    router.push("/analyze");
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-100 flex flex-col items-center justify-center p-4 py-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-10 rounded-[2.5rem] shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent mb-2">
            미래를 읽는 시간
          </h1>
          <p className="text-gray-400 text-sm">
            사주 데이터를 기반으로 당신의 운명을 분석합니다.
          </p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-purple-400 font-medium text-sm">
              <span className="w-5 h-5 rounded-full bg-purple-400/10 flex items-center justify-center text-[10px]">
                1
              </span>
              기본 정보
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="이름"
                value={store.name}
                onChange={(e) => store.setName(e.target.value)}
                className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
              />

              <select
                value={store.gender}
                onChange={(e) => store.setGender(e.target.value)}
                className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-purple-500 text-gray-300 appearance-none hover:cursor-pointer"
              >
                <option value="male" className="bg-[#1a1b2e]">
                  남성
                </option>
                <option value="female" className="bg-[#1a1b2e]">
                  여성
                </option>
              </select>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-purple-400 font-medium text-sm">
              <span className="w-5 h-5 rounded-full bg-purple-400/10 flex items-center justify-center text-[10px]">
                2
              </span>
              출생 정보
            </div>

            <CalendarTypeToggle
              value={store.calendarType}
              onChange={store.setCalendarType}
            />

            <BirthDateInputs
              year={store.birthYear}
              month={store.birthMonth}
              day={store.birthDay}
              setYear={store.setBirthYear}
              setMonth={store.setBirthMonth}
              setDay={store.setBirthDay}
            />

            <BirthTimeSelect
              value={store.birthTime}
              onChange={store.setBirthTime}
            />

            {!!store.birthYear &&
              !!store.birthMonth &&
              !!store.birthDay &&
              !myBirthValid && (
                <p className="text-sm text-red-400">
                  존재하지 않는 날짜예요. 생년월일을 다시 확인해주세요.
                </p>
              )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-purple-400 font-medium text-sm">
              <span className="w-5 h-5 rounded-full bg-purple-400/10 flex items-center justify-center text-[10px]">
                3
              </span>
              운세 테마
            </div>

            <p className="text-sm text-gray-400">
              가장 궁금한 운세를 선택하세요
            </p>

            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => store.setCategory(theme.id)}
                  className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                    store.category === theme.id
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-black/20 border-white/10 hover:border-purple-400"
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </section>

          {isCompatibility && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-pink-400 font-medium text-sm">
                <HeartHandshake size={16} />
                상대 정보
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="상대 이름"
                  value={store.partnerName}
                  onChange={(e) => store.setPartnerName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-pink-500 placeholder:text-gray-600"
                />

                <select
                  value={store.partnerGender}
                  onChange={(e) => store.setPartnerGender(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-pink-500 text-gray-300 appearance-none hover:cursor-pointer"
                >
                  <option value="male" className="bg-[#1a1b2e]">
                    남성
                  </option>
                  <option value="female" className="bg-[#1a1b2e]">
                    여성
                  </option>
                </select>
              </div>

              <CalendarTypeToggle
                value={store.partnerCalendarType}
                onChange={store.setPartnerCalendarType}
              />

              <BirthDateInputs
                year={store.partnerBirthYear}
                month={store.partnerBirthMonth}
                day={store.partnerBirthDay}
                setYear={store.setPartnerBirthYear}
                setMonth={store.setPartnerBirthMonth}
                setDay={store.setPartnerBirthDay}
              />

              <BirthTimeSelect
                value={store.partnerBirthTime}
                onChange={store.setPartnerBirthTime}
              />

              {!!store.partnerBirthYear &&
                !!store.partnerBirthMonth &&
                !!store.partnerBirthDay &&
                !partnerBirthValid && (
                  <p className="text-sm text-red-400">
                    상대 생년월일이 올바르지 않아요. 다시 확인해주세요.
                  </p>
                )}
            </section>
          )}

          <section className="space-y-4">
            <div className="relative">
              <MessageSquare
                className="absolute left-4 top-4 text-gray-500"
                size={18}
              />
              <textarea
                placeholder="구체적인 고민을 적어주시면 AI가 더 정교하게 분석합니다."
                value={store.question}
                onChange={(e) => store.setQuestion(e.target.value)}
                className="w-full bg-black/20 border border-white/10 p-4 pl-12 rounded-2xl focus:outline-none focus:border-purple-500 h-28 resize-none placeholder:text-gray-600"
              />
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white font-bold p-5 rounded-2xl shadow-[0_0_20px_rgba(147,51,234,0.3)] flex items-center justify-center gap-2"
          >
            운명 분석 시작하기
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

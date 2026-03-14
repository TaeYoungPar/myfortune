import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useFortuneStore = create(
  combine(
    {
      name: "",
      gender: "male",

      // 출생 정보
      calendarType: "solar", // solar | lunar
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      birthTime: "",

      category: "",
      question: "",
    },
    (set) => ({
      setName: (name: string) => set({ name }),
      setGender: (gender: string) => set({ gender }),

      setCalendarType: (calendarType: string) => set({ calendarType }),
      setBirthYear: (birthYear: string) => set({ birthYear }),
      setBirthMonth: (birthMonth: string) => set({ birthMonth }),
      setBirthDay: (birthDay: string) => set({ birthDay }),
      setBirthTime: (birthTime: string) => set({ birthTime }),

      setCategory: (category: string) => set({ category }),
      setQuestion: (question: string) => set({ question }),
    }),
  ),
);

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

      // 궁합용 상대 정보
      partnerName: "",
      partnerGender: "female",
      partnerCalendarType: "solar",
      partnerBirthYear: "",
      partnerBirthMonth: "",
      partnerBirthDay: "",
      partnerBirthTime: "",
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

      setPartnerName: (partnerName: string) => set({ partnerName }),
      setPartnerGender: (partnerGender: string) => set({ partnerGender }),
      setPartnerCalendarType: (partnerCalendarType: string) =>
        set({ partnerCalendarType }),
      setPartnerBirthYear: (partnerBirthYear: string) =>
        set({ partnerBirthYear }),
      setPartnerBirthMonth: (partnerBirthMonth: string) =>
        set({ partnerBirthMonth }),
      setPartnerBirthDay: (partnerBirthDay: string) => set({ partnerBirthDay }),
      setPartnerBirthTime: (partnerBirthTime: string) =>
        set({ partnerBirthTime }),
    }),
  ),
);

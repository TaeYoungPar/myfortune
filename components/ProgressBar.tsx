"use client";

import { usePathname } from "next/navigation";

export default function ProgressBar() {
  const path = usePathname();

  const stepMap: any = {
    "/step1": 33,
    "/step2": 66,
    "/step3": 100,
  };

  const progress = stepMap[path] || 0;

  return (
    <div className="w-full bg-zinc-800 h-2">
      <div
        className="bg-purple-500 h-2 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

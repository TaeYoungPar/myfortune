import ProgressBar from "@/components/ProgressBar";

export default function StepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <ProgressBar />

      <div className="flex items-center justify-center p-6">{children}</div>
    </div>
  );
}

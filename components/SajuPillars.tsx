type Pillar = {
  stem: string;
  branch: string;
  pillar: string;
};

type Props = {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
};

export default function SajuPillars({ year, month, day, hour }: Props) {
  const pillars = [
    { label: "년주", value: year.pillar },
    { label: "월주", value: month.pillar },
    { label: "일주", value: day.pillar },
    { label: "시주", value: hour.pillar },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">사주 명식</h2>

      <div className="grid grid-cols-4 gap-4 text-center">
        {pillars.map((p) => (
          <div key={p.label}>
            <div className="text-gray-500 text-sm">{p.label}</div>

            <div className="text-2xl font-bold">{p.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

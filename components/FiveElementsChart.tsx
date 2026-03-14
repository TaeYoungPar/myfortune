type Elements = {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
};

export default function FiveElementsChart({
  elements,
}: {
  elements: Elements;
}) {
  const data = Object.entries(elements);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">오행 분포</h2>

      <div className="space-y-3">
        {data.map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-sm">
              <span>{key}</span>
              <span>{value}</span>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="bg-indigo-500 h-2 rounded"
                style={{
                  width: `${value * 20}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

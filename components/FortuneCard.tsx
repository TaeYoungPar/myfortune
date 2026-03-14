type Props = {
  title: string;
  content: string;
};

export default function FortuneCard({ title, content }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-3">{title}</h2>

      <p className="text-gray-700 whitespace-pre-line">{content}</p>
    </div>
  );
}

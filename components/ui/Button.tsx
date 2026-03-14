interface Props {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button({ children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700"
    >
      {children}
    </button>
  );
}

export default function Payment() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold">
          당신의 운세 리포트가 완성되었습니다
        </h1>

        <p className="mt-4">전체 리포트를 확인하려면 결제하세요</p>

        <button className="mt-6 w-full bg-purple-600 p-3 rounded-lg">
          4,900원 결제하고 보기
        </button>
      </div>
    </div>
  );
}

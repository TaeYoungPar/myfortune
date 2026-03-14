import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "AI 운세",
  description: "AI가 분석하는 당신의 사주",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

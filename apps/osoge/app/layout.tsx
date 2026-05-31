import type { Metadata } from "next";
import "./globals.css";
import NavigationProgress from "./components/NavigationProgress";

export const metadata: Metadata = {
  title: "오소게 | 접수시스템",
  description: "오소게 접수 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <NavigationProgress />
        {children}
      </body>
    </html>
  );
}

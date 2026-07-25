import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "교실 한 장 | 수업 자료를 A4 한 장으로",
      template: "%s | 교실 한 장",
    },
    description:
      "학습지, 활동 안내, 수업 정리 내용을 입력하고 A4 한 장으로 바로 인쇄하거나 PDF로 저장하세요.",
    applicationName: "교실 한 장",
    keywords: ["초등학교", "학습지", "수업자료", "A4", "교사 도구"],
    openGraph: {
      title: "교실 한 장",
      description: "수업에 필요한 내용을 입력하고, A4 한 장으로 바로 정리하세요.",
      type: "website",
      locale: "ko_KR",
      siteName: "교실 한 장",
      images: [
        {
          url: "/og.png",
          width: 1536,
          height: 1024,
          alt: "교실 한 장 — 수업 아이디어를 A4 한 장으로",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "교실 한 장",
      description: "수업 아이디어를 인쇄 가능한 한 장으로.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

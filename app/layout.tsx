import type { Metadata } from "next";
import "./globals.css";

const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER ?? "Eunhorang";
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "classroom-one-page";
const isAccountRootSite =
  repositoryName.toLowerCase() ===
  `${repositoryOwner.toLowerCase()}.github.io`;
const projectPath = isAccountRootSite ? "" : `/${repositoryName}`;
const siteUrl = `https://${repositoryOwner.toLowerCase()}.github.io${projectPath}/`;
const socialImageUrl = new URL("og.png", siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
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
    url: siteUrl,
    type: "website",
    locale: "ko_KR",
    siteName: "교실 한 장",
    images: [
      {
        url: socialImageUrl,
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
    images: [socialImageUrl],
  },
};

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

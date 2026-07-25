import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER ?? "Eunhorang";
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "classroom-one-page";
const isAccountRootSite =
  repositoryName.toLowerCase() ===
  `${repositoryOwner.toLowerCase()}.github.io`;
const basePath =
  isGitHubPages && !isAccountRootSite ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  // 이 앱은 서버 없이 GitHub Pages에서 실행되도록 정적 HTML로 내보냅니다.
  output: "export",
  // 프로젝트 사이트 주소의 저장소 경로를 CSS·JavaScript 파일에도 적용합니다.
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    // GitHub Pages에는 Next.js 이미지 변환 서버가 없으므로 원본을 사용합니다.
    unoptimized: true,
  },
};

export default nextConfig;

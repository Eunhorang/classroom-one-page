import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("교실 한 장의 핵심 화면을 정적 HTML로 만든다", async () => {
  const html = await readFile(
    new URL("../out/index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(html, /<title>교실 한 장 \| 수업 자료를 A4 한 장으로<\/title>/i);
  assert.match(html, /수업에 필요한 내용을,/);
  assert.match(html, /A4 한 장으로\./);
  assert.match(html, /인쇄 · PDF 저장/);
  assert.match(html, /인쇄 창에서 용지/);
  assert.match(html, /배율/);
  assert.match(html, /곱셈으로 생활 속 문제 해결하기/);
  assert.match(html, /개인정보를 입력하지 마세요/);
  assert.doesNotMatch(html, /최소 버전/);
});

test("임시 스타터 흔적을 제거하고 제품 설정을 유지한다", async () => {
  const [page, layout, component, packageJson, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../components/ClassroomOnePage.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /ClassroomOnePage/);
  assert.match(layout, /lang="ko"/);
  assert.match(layout, /next\/font\/local/);
  assert.match(component, /window\.localStorage/);
  assert.match(component, /window\.print\(\)/);
  assert.match(component, /ResizeObserver/);
  assert.match(component, /lesson-sheet-frame/);
  assert.match(component, /theme-option-label/);
  assert.match(packageJson, /"name": "classroom-one-page"/);
  assert.match(packageJson, /"build:pages": "next build"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(packageJson, /vinext|wrangler/);
  assert.match(styles, /--font-pretendard/);
  assert.match(styles, /@media print/);
  assert.match(styles, /size:\s*A4 portrait/);
  assert.match(styles, /transform-origin:\s*top center/);
  assert.doesNotMatch(styles, /\.lesson-sheet\s*\{[^}]*width:\s*640px/s);
  assert.doesNotMatch(styles, /font-family:\s*Georgia/);
  assert.doesNotMatch(page, /codex-preview|SkeletonPreview/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await access(new URL("../app/fonts/PretendardVariable.woff2", import.meta.url));
  await access(projectRoot);
});

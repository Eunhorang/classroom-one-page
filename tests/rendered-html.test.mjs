import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("교실 한 장의 핵심 화면을 서버에서 렌더링한다", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(html, /<title>교실 한 장 \| 수업 자료를 A4 한 장으로<\/title>/i);
  assert.match(html, /수업에 필요한 내용을,/);
  assert.match(html, /A4 한 장으로\./);
  assert.match(html, /인쇄 · PDF 저장/);
  assert.match(html, /곱셈으로 생활 속 문제 해결하기/);
  assert.match(html, /개인정보를 입력하지 마세요/);
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
  assert.match(component, /window\.localStorage/);
  assert.match(component, /window\.print\(\)/);
  assert.match(packageJson, /"name": "classroom-one-page"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(styles, /@media print/);
  assert.match(styles, /size:\s*A4 portrait/);
  assert.doesNotMatch(page, /codex-preview|SkeletonPreview/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await access(projectRoot);
});

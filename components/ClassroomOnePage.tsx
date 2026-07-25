"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MaterialType = "학습지" | "활동 안내" | "수업 정리";
type ThemeName = "forest" | "navy" | "coral";

type LessonDraft = {
  materialType: MaterialType;
  grade: string;
  subject: string;
  theme: ThemeName;
  title: string;
  subtitle: string;
  objective: string;
  materials: string;
  keyPoints: string;
  activities: [string, string, string];
  checks: [string, string, string];
};

const STORAGE_KEY = "classroom-one-page:draft:v1";

const EXAMPLE_DRAFT: LessonDraft = {
  materialType: "학습지",
  grade: "3학년",
  subject: "수학",
  theme: "forest",
  title: "곱셈으로 생활 속 문제 해결하기",
  subtitle: "같은 수만큼 묶인 상황을 곱셈식으로 나타내 봅시다.",
  objective: "생활 속 상황을 곱셈식으로 나타내고 답을 구할 수 있어요.",
  materials: "연필, 색연필",
  keyPoints:
    "같은 수씩 묶여 있는지 살펴봅니다.\n(한 묶음의 수) × (묶음의 수)로 식을 세웁니다.\n곱셈식과 답을 말로 설명합니다.",
  activities: [
    "교실에서 같은 수씩 묶인 물건을 찾아 표시해 보세요.",
    "그림을 보고 알맞은 곱셈식과 답을 써 보세요.",
    "내가 만든 곱셈 문제를 짝에게 설명해 보세요.",
  ],
  checks: [
    "곱셈식을 정확하게 만들었어요.",
    "계산 과정을 설명할 수 있어요.",
    "친구의 설명을 끝까지 들었어요.",
  ],
};

const EMPTY_DRAFT: LessonDraft = {
  materialType: "학습지",
  grade: "3학년",
  subject: "수학",
  theme: "forest",
  title: "",
  subtitle: "",
  objective: "",
  materials: "",
  keyPoints: "",
  activities: ["", "", ""],
  checks: ["", "", ""],
};

const materialTypes: MaterialType[] = ["학습지", "활동 안내", "수업 정리"];
const grades = ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"];
const subjects = [
  "국어",
  "수학",
  "사회",
  "과학",
  "영어",
  "통합",
  "창체",
  "기타",
];

const themeOptions: Array<{ value: ThemeName; label: string }> = [
  { value: "forest", label: "차분한 초록" },
  { value: "navy", label: "또렷한 남색" },
  { value: "coral", label: "따뜻한 주황" },
];

function isMaterialType(value: unknown): value is MaterialType {
  return materialTypes.includes(value as MaterialType);
}

function isTheme(value: unknown): value is ThemeName {
  return themeOptions.some((option) => option.value === value);
}

function safeText(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function safeTuple(value: unknown, fallback: [string, string, string]) {
  if (!Array.isArray(value)) return fallback;
  return [0, 1, 2].map((index) =>
    typeof value[index] === "string" ? value[index] : fallback[index],
  ) as [string, string, string];
}

function normalizeDraft(value: unknown): LessonDraft {
  if (!value || typeof value !== "object") return EXAMPLE_DRAFT;
  const saved = value as Partial<LessonDraft>;

  return {
    materialType: isMaterialType(saved.materialType)
      ? saved.materialType
      : EXAMPLE_DRAFT.materialType,
    grade: safeText(saved.grade, EXAMPLE_DRAFT.grade),
    subject: safeText(saved.subject, EXAMPLE_DRAFT.subject),
    theme: isTheme(saved.theme) ? saved.theme : EXAMPLE_DRAFT.theme,
    title: safeText(saved.title, ""),
    subtitle: safeText(saved.subtitle, ""),
    objective: safeText(saved.objective, ""),
    materials: safeText(saved.materials, ""),
    keyPoints: safeText(saved.keyPoints, ""),
    activities: safeTuple(saved.activities, EMPTY_DRAFT.activities),
    checks: safeTuple(saved.checks, EMPTY_DRAFT.checks),
  };
}

function fieldHint(value: string, maxLength: number) {
  return `${value.length}/${maxLength}`;
}

export function ClassroomOnePage() {
  const [draft, setDraft] = useState<LessonDraft>(EXAMPLE_DRAFT);
  const [isReady, setIsReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState("예시 자료가 준비되었어요");
  const skipNextSave = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedDraft = window.localStorage.getItem(STORAGE_KEY);
        if (savedDraft) {
          setDraft(normalizeDraft(JSON.parse(savedDraft)));
          setSaveStatus("이 기기에 저장된 자료를 불러왔어요");
        }
      } catch {
        setSaveStatus("저장 자료를 읽지 못해 예시를 열었어요");
      } finally {
        setIsReady(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    setSaveStatus("저장 중…");
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        setSaveStatus("이 기기에 자동 저장됨");
      } catch {
        setSaveStatus("자동 저장을 사용할 수 없어요");
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [draft, isReady]);

  const keyPointList = useMemo(
    () =>
      draft.keyPoints
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 4),
    [draft.keyPoints],
  );

  const updateField = <Key extends keyof LessonDraft>(
    key: Key,
    value: LessonDraft[Key],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateActivity = (index: number, value: string) => {
    setDraft((current) => {
      const activities = [...current.activities] as LessonDraft["activities"];
      activities[index] = value;
      return { ...current, activities };
    });
  };

  const updateCheck = (index: number, value: string) => {
    setDraft((current) => {
      const checks = [...current.checks] as LessonDraft["checks"];
      checks[index] = value;
      return { ...current, checks };
    });
  };

  const loadExample = () => {
    setDraft(EXAMPLE_DRAFT);
    setSaveStatus("예시를 불러왔어요");
  };

  const clearDraft = () => {
    const shouldClear = window.confirm(
      "현재 작성한 내용과 브라우저에 저장된 임시 자료를 모두 지울까요?",
    );
    if (!shouldClear) return;

    skipNextSave.current = true;
    window.localStorage.removeItem(STORAGE_KEY);
    setDraft(EMPTY_DRAFT);
    setSaveStatus("입력 내용과 임시 저장 자료를 지웠어요");
  };

  const printDraft = () => {
    window.print();
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#editor-main">
        입력 화면으로 바로 가기
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="교실 한 장 처음으로">
          <span className="brand-mark" aria-hidden="true">
            한
          </span>
          <span>
            <strong>교실 한 장</strong>
            <small>CLASSROOM ONE PAGE</small>
          </span>
        </a>
        <div className="local-save-badge">
          <span className="status-dot" aria-hidden="true" />
          외부 전송 없이, 이 기기에만 저장
        </div>
      </header>

      <main className="app-main" id="top">
        <section className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">교사를 위한 가장 가벼운 수업 자료 도구</p>
          <h1 id="hero-title">
            수업에 필요한 내용을,
            <br />
            <span>A4 한 장으로.</span>
          </h1>
          <p className="hero-description">
            학습지·활동 안내·수업 정리를 입력하고 바로 인쇄하세요.
            <br />
            가입도, 복잡한 설정도 필요 없습니다.
          </p>
          <div className="hero-points" aria-label="주요 특징">
            <span>
              <i aria-hidden="true">01</i> 입력 즉시 미리보기
            </span>
            <span>
              <i aria-hidden="true">02</i> 브라우저 자동 저장
            </span>
            <span>
              <i aria-hidden="true">03</i> 인쇄·PDF 저장
            </span>
          </div>
        </section>

        <div className="workspace">
          <aside className="editor-card" id="editor-main">
            <div className="editor-heading">
              <div>
                <p className="section-kicker">STEP 1</p>
                <h2>한 장 내용 채우기</h2>
              </div>
              <span className="save-status" role="status" aria-live="polite">
                <span aria-hidden="true">✓</span>
                {saveStatus}
              </span>
            </div>

            <div className="editor-actions">
              <button className="button button-soft" type="button" onClick={loadExample}>
                <span aria-hidden="true">↺</span>
                예시 불러오기
              </button>
              <button
                className="button button-ghost"
                type="button"
                onClick={clearDraft}
              >
                새 문서
              </button>
            </div>

            <form className="lesson-form" onSubmit={(event) => event.preventDefault()}>
              <fieldset className="form-section">
                <legend>
                  <span>1</span> 기본 정보
                </legend>
                <div className="field-grid field-grid-three">
                  <label className="field">
                    <span>자료 유형</span>
                    <select
                      value={draft.materialType}
                      onChange={(event) =>
                        updateField(
                          "materialType",
                          event.target.value as MaterialType,
                        )
                      }
                    >
                      {materialTypes.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>학년</span>
                    <select
                      value={draft.grade}
                      onChange={(event) => updateField("grade", event.target.value)}
                    >
                      {grades.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>교과</span>
                    <select
                      value={draft.subject}
                      onChange={(event) => updateField("subject", event.target.value)}
                    >
                      {subjects.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="theme-field">
                  <span className="theme-label">강조 색상</span>
                  <div className="theme-options" role="radiogroup" aria-label="강조 색상">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`theme-option theme-option-${option.value}`}
                        type="button"
                        role="radio"
                        aria-checked={draft.theme === option.value}
                        aria-label={option.label}
                        title={option.label}
                        onClick={() => updateField("theme", option.value)}
                      >
                        <span aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>

              <fieldset className="form-section">
                <legend>
                  <span>2</span> 제목과 목표
                </legend>
                <label className="field">
                  <span className="field-label-row">
                    <span>자료 제목</span>
                    <small>{fieldHint(draft.title, 45)}</small>
                  </span>
                  <input
                    type="text"
                    value={draft.title}
                    maxLength={45}
                    placeholder="예: 곱셈으로 생활 속 문제 해결하기"
                    onChange={(event) => updateField("title", event.target.value)}
                  />
                </label>
                <label className="field">
                  <span className="field-label-row">
                    <span>한 줄 안내</span>
                    <small>{fieldHint(draft.subtitle, 90)}</small>
                  </span>
                  <input
                    type="text"
                    value={draft.subtitle}
                    maxLength={90}
                    placeholder="학생이 무엇을 할지 한 문장으로 적어 주세요."
                    onChange={(event) => updateField("subtitle", event.target.value)}
                  />
                </label>
                <label className="field">
                  <span className="field-label-row">
                    <span>학습 목표</span>
                    <small>{fieldHint(draft.objective, 110)}</small>
                  </span>
                  <textarea
                    rows={2}
                    value={draft.objective}
                    maxLength={110}
                    placeholder="예: 생활 속 상황을 곱셈식으로 나타낼 수 있어요."
                    onChange={(event) => updateField("objective", event.target.value)}
                  />
                </label>
              </fieldset>

              <fieldset className="form-section">
                <legend>
                  <span>3</span> 준비와 핵심 내용
                </legend>
                <label className="field">
                  <span className="field-label-row">
                    <span>준비물</span>
                    <small>{fieldHint(draft.materials, 70)}</small>
                  </span>
                  <input
                    type="text"
                    value={draft.materials}
                    maxLength={70}
                    placeholder="예: 연필, 색연필, 붙임 딱지"
                    onChange={(event) => updateField("materials", event.target.value)}
                  />
                </label>
                <label className="field">
                  <span className="field-label-row">
                    <span>핵심 내용</span>
                    <small>{fieldHint(draft.keyPoints, 240)}</small>
                  </span>
                  <textarea
                    rows={5}
                    value={draft.keyPoints}
                    maxLength={240}
                    placeholder={"핵심 내용을 한 줄에 하나씩 적어 주세요.\n최대 4개가 표시됩니다."}
                    onChange={(event) => updateField("keyPoints", event.target.value)}
                  />
                  <small className="field-help">한 줄에 하나씩, 최대 4줄</small>
                </label>
              </fieldset>

              <fieldset className="form-section">
                <legend>
                  <span>4</span> 수업 활동
                </legend>
                <div className="stacked-fields">
                  {draft.activities.map((activity, index) => (
                    <label className="field numbered-field" key={`activity-${index}`}>
                      <b aria-hidden="true">{index + 1}</b>
                      <span className="visually-hidden">활동 {index + 1}</span>
                      <textarea
                        rows={2}
                        value={activity}
                        maxLength={100}
                        placeholder={`활동 ${index + 1} 내용을 입력하세요.`}
                        onChange={(event) =>
                          updateActivity(index, event.target.value)
                        }
                      />
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="form-section">
                <legend>
                  <span>5</span> 자기 점검
                </legend>
                <div className="stacked-fields compact">
                  {draft.checks.map((check, index) => (
                    <label className="field check-field" key={`check-${index}`}>
                      <i aria-hidden="true" />
                      <span className="visually-hidden">점검 문장 {index + 1}</span>
                      <input
                        type="text"
                        value={check}
                        maxLength={55}
                        placeholder={`점검 문장 ${index + 1}`}
                        onChange={(event) => updateCheck(index, event.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            </form>

            <div className="privacy-note">
              <span className="privacy-icon" aria-hidden="true">
                i
              </span>
              <p>
                <strong>개인정보를 입력하지 마세요.</strong>
                입력 내용은 현재 브라우저에만 저장되고 외부 서버로 전송되지
                않습니다. 공용 컴퓨터에서는 사용 후 ‘새 문서’를 눌러 주세요.
              </p>
            </div>
          </aside>

          <section className="preview-area" aria-labelledby="preview-title">
            <div className="preview-toolbar">
              <div>
                <p className="section-kicker">STEP 2</p>
                <h2 id="preview-title">A4 미리보기</h2>
              </div>
              <button
                className="button button-primary"
                type="button"
                onClick={printDraft}
              >
                <span aria-hidden="true">⇩</span>
                인쇄 · PDF 저장
              </button>
            </div>

            <div className="paper-stage">
              <article
                className="lesson-sheet"
                data-theme={draft.theme}
                aria-label="A4 수업 자료 미리보기"
              >
                <header className="sheet-header">
                  <div className="sheet-topline">
                    <div className="sheet-mini-brand">
                      <span aria-hidden="true">한</span>
                      교실 한 장
                    </div>
                    <div className="sheet-tags">
                      <span>{draft.materialType}</span>
                      <span>{draft.grade}</span>
                      <span>{draft.subject}</span>
                    </div>
                  </div>
                  <h2>{draft.title || "자료 제목을 입력해 주세요"}</h2>
                  <p>{draft.subtitle || "한 줄 안내가 이곳에 표시됩니다."}</p>
                </header>

                <section className="sheet-objective">
                  <div className="sheet-section-label">
                    <span aria-hidden="true">◎</span>
                    오늘의 목표
                  </div>
                  <p>
                    {draft.objective ||
                      "오늘 배울 내용을 학생이 이해하기 쉬운 문장으로 적어 주세요."}
                  </p>
                </section>

                <div className="sheet-info-grid">
                  <section className="sheet-materials">
                    <div className="sheet-section-label">
                      <span aria-hidden="true">□</span>
                      준비물
                    </div>
                    <p>{draft.materials || "필요한 준비물을 입력해 주세요."}</p>
                  </section>

                  <section className="sheet-key-points">
                    <div className="sheet-section-label">
                      <span aria-hidden="true">!</span>
                      꼭 기억해요
                    </div>
                    {keyPointList.length > 0 ? (
                      <ul>
                        {keyPointList.map((point, index) => (
                          <li key={`${point}-${index}`}>
                            <span aria-hidden="true">{index + 1}</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="sheet-placeholder">
                        핵심 내용을 한 줄에 하나씩 입력해 주세요.
                      </p>
                    )}
                  </section>
                </div>

                <section className="sheet-activities">
                  <div className="sheet-section-heading">
                    <div>
                      <span className="sheet-heading-number">01</span>
                      <h3>차근차근 해봐요</h3>
                    </div>
                    <small>ACTIVITY</small>
                  </div>
                  <div className="activity-list">
                    {draft.activities.map((activity, index) => (
                      <div className="activity-item" key={`sheet-activity-${index}`}>
                        <span className="activity-number" aria-hidden="true">
                          {index + 1}
                        </span>
                        <p>{activity || `활동 ${index + 1} 내용을 입력해 주세요.`}</p>
                        <span className="activity-check" aria-hidden="true" />
                      </div>
                    ))}
                  </div>
                </section>

                <section className="sheet-checks">
                  <div className="sheet-section-heading">
                    <div>
                      <span className="sheet-heading-number">02</span>
                      <h3>스스로 확인해요</h3>
                    </div>
                    <small>CHECK</small>
                  </div>
                  <div className="check-list">
                    {draft.checks.map((check, index) => (
                      <div className="check-item" key={`sheet-check-${index}`}>
                        <span aria-hidden="true" />
                        <p>{check || `점검 문장 ${index + 1}을 입력해 주세요.`}</p>
                        <div className="check-choice" aria-label="확인 표시 칸">
                          <i /> <small>했어요</small>
                          <i /> <small>더 해볼래요</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <footer className="sheet-footer">
                  <span>이름</span>
                  <i aria-hidden="true" />
                  <p>오늘도 한 장만큼 성장했어요.</p>
                  <b>교실 한 장</b>
                </footer>
              </article>
            </div>

            <p className="print-help">
              Mac에서는 인쇄 창 왼쪽 아래의 <strong>PDF</strong> →{" "}
              <strong>PDF로 저장</strong>을 선택하세요.
            </p>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <p>
          교실의 아이디어가 좋은 한 장으로 이어지도록.
          <span>교실 한 장 · 최소 버전</span>
        </p>
      </footer>
    </div>
  );
}

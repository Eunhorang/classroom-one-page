# 교실 한 장

수업에 필요한 내용을 입력하면 A4 세로 한 장짜리 자료로 정리해 주는 초등학교 교사용 웹앱입니다.

로그인이나 API 키 없이 바로 사용할 수 있습니다. 입력한 내용은 외부 서버가 아니라 현재 사용 중인 브라우저 안에만 임시 저장됩니다.

GitHub Pages 배포 주소:

```text
https://eunhorang.github.io/classroom-one-page/
```

## 1. 무엇을 만들었나요?

- `학습지`, `활동 안내`, `수업 정리` 중 자료 유형 선택
- 1~6학년과 교과 선택
- 제목, 한 줄 안내, 학습 목표, 준비물 입력
- 핵심 내용 최대 4개 입력
- 수업 활동 3개와 자기 점검 3개 입력
- 오른쪽 A4 미리보기에 입력 내용 즉시 반영
- 초록·남색·주황 강조 색상 선택
- 작성 내용 브라우저 자동 저장
- 인쇄 또는 PDF 저장
- 스마트폰과 태블릿 화면 대응

## 2. 프로젝트 파일 구조

```text
교실 한 장/
├─ app/
│  ├─ fonts/
│  │  └─ PretendardVariable.woff2 # 화면·인쇄용 한글 글꼴
│  ├─ globals.css                 # 전체 화면, 모바일, A4 인쇄 디자인
│  ├─ layout.tsx                  # 사이트 제목, 설명, 로컬 글꼴 설정
│  └─ page.tsx                    # 첫 화면을 불러오는 파일
├─ components/
│  └─ ClassroomOnePage.tsx        # 입력, 자동 저장, 미리보기, 인쇄 기능
├─ docs/
│  ├─ og-card.html                # 소셜 공유 이미지 디자인 원본
│  └─ og-image-prompt.md          # 소셜 공유 이미지 제작 안내
├─ public/
│  ├─ fonts/
│  │  └─ PRETENDARD-LICENSE.txt   # Pretendard 글꼴 라이선스
│  └─ og.png                      # 링크 공유용 대표 이미지
├─ tests/
│  └─ rendered-html.test.mjs      # 핵심 화면과 설정 자동 검사
├─ .github/
│  └─ workflows/
│     ├─ ci.yml                   # 코드와 기능 자동 검사
│     └─ pages.yml                # GitHub Pages 자동 배포
├─ .env.example                   # 환경 변수 안내(현재는 설정 불필요)
├─ AGENTS.md                      # 이 프로젝트의 GitHub Pages 배포 원칙
├─ next.config.ts                 # 정적 사이트와 저장소 경로 설정
├─ package.json                   # 실행 명령과 사용 라이브러리
└─ README.md                      # 현재 안내 문서
```

## 3. Mac에서 실행하기

### 준비

Node.js 22.13 이상이 필요합니다. Node.js는 웹앱을 컴퓨터에서 실행해 주는 프로그램입니다.

터미널을 열고 이 프로젝트 폴더로 이동합니다.

```bash
cd "/Users/j.jlee/Documents/교실 한 장"
```

아래 명령은 필요한 프로그램 묶음을 설치합니다.

```bash
npm install
```

아래 명령은 웹앱을 내 컴퓨터에서 실행합니다.

```bash
npm run dev
```

브라우저에서 다음 주소를 엽니다.

```text
http://localhost:3000
```

실행을 끝낼 때는 터미널에서 `Control + C`를 누릅니다.

## 4. 직접 테스트하는 방법

1. 브라우저에서 `http://localhost:3000`에 접속합니다.
2. 첫 화면에 곱셈 학습지 예시와 A4 미리보기가 보이는지 확인합니다.
3. `자료 제목`을 다른 문장으로 바꾸고 오른쪽 미리보기가 즉시 바뀌는지 확인합니다.
4. 강조 색상을 남색 또는 주황으로 바꾸고 A4 색상이 바뀌는지 확인합니다.
5. 새로고침하고 작성 내용이 그대로 남아 있는지 확인합니다.
6. `새 문서`를 누른 뒤 확인 창에서 승인하고 내용이 지워지는지 확인합니다.
7. `예시 불러오기`를 눌러 곱셈 예시가 다시 채워지는지 확인합니다.
8. `인쇄 · PDF 저장`을 누릅니다.
9. 인쇄 미리보기에서 A4 세로 한 장으로 표시되는지 확인합니다.
10. Mac 인쇄 창 왼쪽 아래 `PDF` → `PDF로 저장`을 선택하고 한글이 깨지지 않는지 확인합니다.
11. 브라우저 폭을 줄여 스마트폰 크기에서도 버튼과 입력창이 화면 밖으로 나가지 않는지 확인합니다.

자동 검사도 실행할 수 있습니다.

코드 문법과 작성 규칙을 확인합니다.

```bash
npm run lint
```

배포용 파일을 만들고 핵심 화면을 검사합니다.

```bash
npm test
```

## 5. GitHub에 올리고 github.io로 배포하기

GitHub 로그인 상태를 먼저 확인합니다.

```bash
gh auth status
```

로그인이 풀려 있다면 다음 명령으로 다시 로그인합니다.

```bash
gh auth login -h github.com -p https -w
```

이 프로젝트는 `main` 브랜치에 새 코드가 올라오면 GitHub Actions가 자동으로 검사하고 GitHub Pages에 배포합니다.

GitHub Actions는 GitHub 안에서 명령을 자동으로 실행해 주는 작업 도우미입니다. 배포 설정은 `.github/workflows/pages.yml`에 있습니다.

직접 배포용 정적 파일이 만들어지는지 확인하려면 다음 명령을 실행합니다.

```bash
GITHUB_PAGES=true GITHUB_REPOSITORY="Eunhorang/classroom-one-page" GITHUB_REPOSITORY_OWNER="Eunhorang" npm run build:pages
```

성공하면 `out` 폴더가 만들어집니다. GitHub Pages가 이 폴더의 내용을 웹사이트로 공개합니다.

자동 배포 순서는 다음과 같습니다.

1. GitHub 저장소의 `main` 브랜치에 변경 내용 올리기
2. `교실 한 장 자동 검사`가 성공하는지 확인하기
3. `GitHub Pages 배포`가 성공하는지 확인하기
4. `https://eunhorang.github.io/classroom-one-page/`에 접속하기

GitHub Free 요금제에서는 공개 저장소에 GitHub Pages를 사용할 수 있습니다. 비공개 저장소에서 Pages를 사용할 수 없는 경우에는 저장소 공개 전환 전에 소스가 누구에게나 보인다는 점을 확인해야 합니다.

## 6. 자주 생기는 오류

### 오류 메시지: `command not found: npm`

- 발생 원인: Node.js가 설치되지 않았습니다.
- 해결 방법: [Node.js 공식 사이트](https://nodejs.org/)에서 LTS 버전을 설치한 뒤 터미널을 다시 엽니다.
- 확인할 파일: 별도 파일 없음

### 오류 메시지: `EADDRINUSE: address already in use`

- 발생 원인: 이미 다른 앱이 3000번 주소를 사용하고 있습니다.
- 해결 방법: 기존에 실행 중인 개발 서버 터미널에서 `Control + C`를 누른 뒤 다시 `npm run dev`를 실행합니다.
- 확인할 파일: 별도 파일 없음

### 오류 메시지: `Failed to log in to github.com`

- 발생 원인: GitHub 로그인 정보가 만료되었습니다.
- 해결 방법: `gh auth login -h github.com -p https -w`를 실행하고 브라우저에서 로그인합니다.
- 확인할 파일: 별도 파일 없음

### GitHub Pages 주소에서 `404`가 보이는 경우

- 발생 원인: Pages 기능이 아직 켜지지 않았거나 첫 배포가 진행 중입니다.
- 해결 방법: GitHub 저장소의 `Actions`에서 `GitHub Pages 배포`가 성공했는지 확인하고 최대 10분 정도 기다립니다.
- 확인할 파일: `.github/workflows/pages.yml`, `next.config.ts`

### 화면은 열리지만 디자인이 적용되지 않는 경우

- 발생 원인: 저장소 이름인 `/classroom-one-page` 경로가 CSS와 JavaScript 주소에 적용되지 않았습니다.
- 해결 방법: `GITHUB_PAGES=true` 설정으로 다시 빌드하고 `next.config.ts`의 `basePath` 설정을 확인합니다.
- 확인할 파일: `next.config.ts`

### PDF가 두 장으로 나뉘는 경우

- 발생 원인: 브라우저 인쇄 배율 또는 여백 설정이 바뀌었습니다.
- 해결 방법: 용지를 `A4`, 방향을 `세로`, 여백을 `없음` 또는 `기본값`, 배율을 `100%`로 설정합니다.
- 확인할 파일: `app/globals.css`

### 한글 글꼴이 적용되지 않는 경우

- 발생 원인: 배포 파일에 로컬 Pretendard 글꼴이 포함되지 않았거나 정적 파일 경로가 잘못되었습니다.
- 해결 방법: `app/fonts/PretendardVariable.woff2`가 있는지 확인한 뒤 GitHub Pages 전용 빌드를 다시 실행합니다.
- 확인할 파일: `app/fonts/PretendardVariable.woff2`, `app/layout.tsx`, `next.config.ts`

## 7. 개인정보 보호

- 학생 실명, 연락처, 주소, 상담 내용 등 민감한 정보는 입력하지 마세요.
- 입력 내용은 현재 브라우저의 `localStorage`에 저장됩니다. `localStorage`는 브라우저 안에 간단한 값을 보관하는 작은 서랍과 같습니다.
- 외부 AI 서비스나 데이터베이스로 입력 내용을 보내지 않습니다.
- 같은 자료가 다른 컴퓨터나 휴대폰으로 자동 동기화되지는 않습니다.
- 공용 컴퓨터에서는 작업 후 반드시 `새 문서`를 눌러 저장 내용을 지워 주세요.
- GitHub에 올리기 전 예시나 파일에 실제 학생 정보가 없는지 확인하세요.

## 8. 현재 최소 버전에 포함하지 않은 기능

- AI 자동 문장 생성
- 회원가입과 로그인
- 여러 기기 간 동기화
- 학생별 기록 관리
- DOCX·PPTX 파일 생성

이 기능들은 최소 버전이 안정적으로 작동한 뒤 한 단계씩 추가하는 것이 안전합니다.

## 9. 완료 점검 체크리스트

- [ ] 첫 화면이 오류 없이 열린다.
- [ ] 입력값이 A4 미리보기에 즉시 반영된다.
- [ ] 새로고침 후 작성 내용이 유지된다.
- [ ] `새 문서`가 입력 내용과 임시 저장을 지운다.
- [ ] A4 세로 한 장으로 인쇄된다.
- [ ] PDF의 한글이 깨지지 않는다.
- [ ] 스마트폰 화면에서도 입력할 수 있다.
- [ ] 실제 학생 개인정보가 소스와 예시에 없다.
- [ ] `npm run lint`가 성공한다.
- [ ] `npm test`가 성공한다.
- [ ] `npm run build:pages`가 성공하고 `out` 폴더가 생성된다.
- [ ] `https://eunhorang.github.io/classroom-one-page/`에서 디자인과 기능이 정상 표시된다.

# 법무법인(유한) 청률 모바일 웹 & PWA

법무법인(유한) 청률의 공식 모바일 웹 애플리케이션입니다. 스마트폰 화면에 최적화된 인터페이스를 제공하며, 모바일 브라우저 접속 및 홈 화면 앱 설치(PWA / Android TWA)를 모두 지원합니다.

- **서비스 주소**: [https://2gateless.github.io/bluelaw/](https://2gateless.github.io/bluelaw/)
- **저장소**: [https://github.com/2gateless/bluelaw](https://github.com/2gateless/bluelaw)
- **기술 스택**: React 19, Vite, Lucide Icons, Vanilla CSS, PWA (Service Worker + TWA Asset Links)

---

## 📱 주요 기능

1. **홈 (소개 및 알림)**
   - 법인 인사말 및 철학 소개
   - **중대재해 대응팀 운영 안내**: 담당 구성원 변호사 프로필 및 컴플라이언스·사고 대응 주요 업무 상세 안내
   - 하단 사무소 주소 요약 표시

2. **변호사 소개**
   - **구성원 변호사 (15인)** 및 **소속 변호사 (2인)** 프로필 목록
   - 경량화된 고화질 프로필 사진(WebP + PNG 폴백)과 주요 경력 안내
   - '자세히 보기' 클릭 시 앱 내 맞춤 뷰어로 상세 이력 페이지 제공

3. **주요 업무분야**
   - 7개 핵심 분야(민사, 형사, 가사, 일반행정, 기업회생 및 파산, 조세, 중재)
   - 작은 화면의 스마트폰에서도 한눈에 파악할 수 있는 컴팩트 그리드 레이아웃
   - 각 분야 클릭 시 해당 전문 웹페이지를 모바일 프레임 맞춤 뷰어로 표시

4. **성공 사례**
   - 홈페이지에 등록된 **160여 건 이상의 성공사례 전수 수록** (사례 탭 진입 시 지연 로딩, 30건 단위 더보기 지원)
   - **실시간 검색**: 사건명이나 키워드(예: 손해배상, 기각, 이혼, 회생 등) 입력 시 `useDeferredValue` 기반 즉시 필터링
   - **분야별 필터**: 민사, 형사, 가사, 일반행정/조세, 기업회생/파산 등 카테고리별 필터링
   - 항목 클릭 시 본문 확인 후 '← 뒤로' 버튼 또는 스마트폰 뒤로가기 버튼으로 목록 복귀

5. **문의 및 오시는 길**
   - 법률 상담 직통 전화, 사무소 주소, 상담 및 업무 시간 안내
   - 네이버 지도로 위치 및 길찾기 바로가기

6. **모바일 최적화 & PWA / TWA**
   - **스마트폰 뒤로가기 버튼 완벽 연동**: History API를 통해 탭·하위 화면·외부 뷰어 이동 시 단계적으로 복귀하며 첫 화면에서만 앱 종료
   - **코드 스플리팅 및 에러 바운더리**: 하위 탭 지연 로딩(`React.lazy`)과 `ErrorBoundary` 복구 UI 적용
   - **자동 캐시 버전 관리 Service Worker**: 빌드 시마다 `dist/sw.js`에 고유 빌드 버전이 자동 주입되어 배포 시 구버전 캐시를 자동 정리하고 오프라인 실행 지원
   - **Android TWA 연동**: [`public/.well-known/assetlinks.json`](./public/.well-known/assetlinks.json) 포함

---

## 💡 유지보수 및 기억해야 할 사항

### 1. 정보 수정 방법 (데이터 분리 구조)
앱의 주요 텍스트와 목록은 `src/data/` 폴더 내 JSON 파일로 분리되어 있어 손쉽게 변경할 수 있습니다.

| 수정할 대상 | 파일 위치 | 설명 |
|---|---|---|
| **변호사 정보** | [`src/data/lawyers.json`](./src/data/lawyers.json) | 구성원·소속 변호사 추가, 이름, 직함, 경력, 사진 경로, 상세 링크 수정 |
| **알림 / 전담팀 안내** | [`src/data/notices.json`](./src/data/notices.json) | 첫 화면 알림 제목, 중대재해 대응팀 담당 변호사 명단 및 주요 업무 항목 수정 |
| **업무분야** | [`src/data/services.json`](./src/data/services.json) | 업무분야 명칭, 아이콘, 연결 웹페이지 URL 수정 |
| **법인 기본 정보** | [`src/data/company.json`](./src/data/company.json) | 법인명, 대표전화, 주소, 지도 URL, 인사말 수정 |

> **새 변호사 사진 추가 시 팁**:
> 1. 사진 파일(`.webp` 및 폴백용 `.png`, 권장 비율 약 200×280)을 [`public/images/`](./public/images/) 폴더에 넣습니다.
> 2. `src/data/lawyers.json`의 `photo` 경로에 `.webp` 파일 경로를 적어주면 자동 반영됩니다.

---

### 2. 성공사례 자동 동기화 (Monthly Sync)
- **단일 데이터 파일**: [`public/cases.json`](./public/cases.json)
- **동작 주기**: **매월 18일 오전 09:00 (한국 시간)**에 GitHub Actions가 자동으로 실행됩니다.
- **동작 내용**:
  1. [`scripts/sync_cases.py`](./scripts/sync_cases.py)가 `bluelaw.co.kr`의 성공사례 게시판을 전체 크롤링합니다 (페이지별 최대 3회 자동 재시도).
  2. 중간 페이지 오류 시 즉시 중단하며, 수집 건수가 기존 데이터의 90%(최소 50건) 미만으로 급감하면 덮어쓰지 않는 안전장치가 동작합니다.
  3. 정상 수집 시 `public/cases.json`과 `last_synced.txt`(60일 비활성 워크플로우 정지 방지용)를 갱신하여 자동 커밋 후 GitHub Pages로 재배포합니다.
- **수동 즉시 동기화**:
  홈페이지에 새 글이 올라와 바로 반영하고 싶을 때는 GitHub 리포지토리의 **Actions → Build and Deploy to GitHub Pages → Run workflow** 버튼을 누르면 즉시 동기화 및 배포됩니다.

---

## 🛠️ 개발 및 빌드 환경

```bash
# 패키지 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 프로덕션 빌드 (dist/ 폴더 생성 및 sw.js 캐시 버전 자동 주입)
npm run build

# 빌드 결과물 미리보기
npm run preview
```

### 배포 파이프라인
- `main` 브랜치에 코드를 푸시하면 [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) 워크플로우가 실행되어 `dist/` 폴더를 GitHub Pages로 자동 빌드 및 배포합니다.

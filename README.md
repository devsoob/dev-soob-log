# Dev Soob Log

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📱 모바일 반응형 테스트

이 프로젝트는 다양한 디바이스에서의 UI/UX를 확인하기 위한 종합적인 모바일 반응형 테스트 도구를 제공합니다.

### 🚀 빠른 시작

```bash
# 모든 모바일 반응형 테스트 실행
npm run test:mobile:all

# 개별 테스트 실행
npm run test:mobile:dev          # 모바일 반응형 스크린샷 테스트
npm run test:responsive-issues:dev # 반응형 문제점 감지
```

### 🛠️ 테스트 도구

#### 1. 자동화된 테스트 스크립트
- **모바일 반응형 테스트**: 다양한 디바이스에서 스크린샷 촬영
- **반응형 문제점 감지**: 자동으로 반응형 디자인 문제점 감지
- **종합 테스트**: 모든 테스트를 순차적으로 실행

#### 2. 실시간 반응형 테스트 페이지
- URL: `http://localhost:3000/test-responsive`
- 다양한 디바이스 뷰포트에서 실시간 확인
- iframe을 통한 실제 페이지 렌더링 테스트

#### 3. 브라우저 개발자 도구
- Chrome DevTools Device Toolbar
- Firefox Responsive Design Mode
- Safari Web Inspector

### 📱 테스트 디바이스

#### iOS 디바이스
- iPhone SE (375 × 667)
- iPhone 12 Pro (390 × 844)
- iPhone 12 Pro Max (428 × 926)
- iPad (768 × 1024)
- iPad Pro (1024 × 1366)

#### Android 디바이스
- Samsung Galaxy S20 (360 × 800)
- Samsung Galaxy Tab S7 (800 × 1280)

### 📄 테스트 페이지

- 메인 페이지 (`/`)
- 포스트 목록 (`/posts`)
- 소개 페이지 (`/about`)
- 태그 페이지 (`/tags`)
- 카테고리 페이지 (`/categories`)

### 📊 테스트 결과

테스트 실행 후 다음 파일들이 생성됩니다:

```
mobile-test-results/
├── report.html                    # 모바일 반응형 테스트 리포트
├── responsive-issues-report.html  # 반응형 문제점 감지 리포트
├── summary-report.html           # 종합 테스트 리포트
├── test-results.json             # 테스트 결과 데이터
├── responsive-issues.json        # 문제점 감지 결과
└── test-summary.json             # 종합 요약 데이터
```

### 🧪 수동 테스트

브라우저 개발자 도구를 사용한 수동 테스트:

1. 브라우저에서 `F12` 또는 `Cmd+Option+I` (Mac)
2. Device Toolbar 활성화
3. 다양한 디바이스 선택
4. 각 페이지별 테스트 수행

### 📋 체크리스트

자세한 테스트 체크리스트는 [MOBILE_RESPONSIVE_TEST.md](./MOBILE_RESPONSIVE_TEST.md)를 참조하세요.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

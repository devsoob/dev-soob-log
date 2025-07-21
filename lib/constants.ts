// 사이트 설정
export const SITE_CONFIG = {
  name: 'Dev Soob Log',
  description: 'Choi Soobin의 개발 블로그',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app',
  author: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Choi Soobin',
  defaultAvatar: '/images/default-avatar.png',
  ogImage: '/og-image.png',
} as const;

// SEO 설정
export const SEO_CONFIG = {
  titleTemplate: '%s | Dev Soob Log',
  keywords: 'development, programming, web development, software engineering, tech blog',
  themeColor: '#000000',
  locale: 'ko_KR',
  twitterHandle: '@handle',
  twitterSite: '@site',
  twitterCardType: 'summary_large_image',
} as const;

// 메타 태그 설정
export const META_TAGS = {
  viewport: 'width=device-width, initial-scale=1',
  naverSiteVerification: '01f879679eb5dd93ae99dc948742910e33135369',
  googleSiteVerification: 'YOUR_GOOGLE_SITE_VERIFICATION_CODE_HERE',
  appleMobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'black',
} as const;

// 페이지네이션 설정
export const PAGINATION_CONFIG = {
  postsPerPage: 10,
  maxVisiblePages: 5,
} as const;

// 검색 설정
export const SEARCH_CONFIG = {
  debounceDelay: 300,
  minSearchLength: 1,
} as const;

// 라우트 경로
export const ROUTES = {
  home: '/',
  posts: '/posts',
  tags: '/tags',
  categories: '/categories',
  api: {
    search: '/api/search',
  },
} as const;

// 포스트 상태
export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

// 포스트 소스
export const POST_SOURCE = {
  NOTION: 'notion',
  MARKDOWN: 'markdown',
} as const;

// 테마 설정
export const THEME_CONFIG = {
  light: 'light',
  dark: 'dark',
  system: 'system',
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  theme: 'theme',
  searchHistory: 'searchHistory',
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  searchFailed: '검색 중 오류가 발생했습니다.',
  postNotFound: '포스트를 찾을 수 없습니다.',
  networkError: '네트워크 오류가 발생했습니다.',
  unknownError: '알 수 없는 오류가 발생했습니다.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  searchCompleted: '검색이 완료되었습니다.',
  postPublished: '포스트가 성공적으로 게시되었습니다.',
} as const; 
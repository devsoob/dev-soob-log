const fs = require('fs');
const path = require('path');

// 포스트별 키워드 매핑
const postKeywords = {
  '2025-01-10-vuejs-frontend-framework.md': {
    keywords: ["Vue.js", "Vue", "프론트엔드", "JavaScript", "컴포넌트", "반응형", "싱글 페이지 애플리케이션", "SPA", "Composition API", "Options API"],
    description: "Vue.js를 사용하여 현대적인 프론트엔드 애플리케이션을 구축하는 방법을 알아봅니다. 컴포넌트 기반 개발, 반응형 데이터 바인딩, 라우팅 등 Vue.js 핵심 개념을 실습과 함께 학습하세요."
  },
  '2025-01-11-postgresql-database.md': {
    keywords: ["PostgreSQL", "데이터베이스", "SQL", "관계형 데이터베이스", "RDBMS", "쿼리 최적화", "인덱싱", "트랜잭션", "백업", "복구"],
    description: "PostgreSQL을 사용하여 강력하고 확장 가능한 데이터베이스를 구축하는 방법을 알아봅니다. 쿼리 최적화, 인덱싱, 트랜잭션 관리 등 실무에서 바로 적용할 수 있는 PostgreSQL 가이드입니다."
  },
  '2025-01-12-redis-caching.md': {
    keywords: ["Redis", "캐싱", "인메모리 데이터베이스", "NoSQL", "성능 최적화", "세션 관리", "실시간 처리", "Pub/Sub", "클러스터링"],
    description: "Redis를 사용하여 애플리케이션 성능을 향상시키는 캐싱 전략을 구현하는 방법을 알아봅니다. 인메모리 캐싱, 세션 관리, 실시간 데이터 처리 등 Redis 활용법을 학습하세요."
  },
  '2025-01-13-graphql-api-design.md': {
    keywords: ["GraphQL", "API", "쿼리 언어", "스키마", "리졸버", "타입 시스템", "실시간", "Subscription", "Apollo", "Relay"],
    description: "GraphQL을 사용하여 효율적이고 유연한 API를 설계하는 방법을 알아봅니다. 스키마 설계, 리졸버 구현, 실시간 데이터 처리 등 GraphQL 핵심 개념을 실습과 함께 학습하세요."
  },
  '2025-01-14-jest-testing-framework.md': {
    keywords: ["Jest", "테스팅", "JavaScript", "단위 테스트", "통합 테스트", "모킹", "코버리지", "TDD", "BDD", "테스트 자동화"],
    description: "Jest를 사용하여 JavaScript 애플리케이션의 테스트를 작성하고 실행하는 방법을 알아봅니다. 단위 테스트, 통합 테스트, 모킹, 코드 커버리지 등 테스트 작성 기법을 학습하세요."
  },
  '2025-01-15-webpack-module-bundler.md': {
    keywords: ["Webpack", "모듈 번들러", "빌드 도구", "JavaScript", "번들링", "최적화", "로더", "플러그인", "코드 스플리팅", "트리 쉐이킹"],
    description: "Webpack을 사용하여 JavaScript 모듈을 번들링하고 최적화하는 방법을 알아봅니다. 로더, 플러그인, 코드 스플리팅, 트리 쉐이킹 등 Webpack 고급 기능을 학습하세요."
  },
  '2025-01-16-nginx-web-server.md': {
    keywords: ["Nginx", "웹 서버", "리버스 프록시", "로드 밸런싱", "캐싱", "SSL", "HTTPS", "성능 최적화", "고가용성", "마이크로서비스"],
    description: "Nginx를 사용하여 고성능 웹 서버와 리버스 프록시를 구성하는 방법을 알아봅니다. 로드 밸런싱, SSL 설정, 캐싱, 성능 최적화 등 실무에서 바로 적용할 수 있는 Nginx 가이드입니다."
  },
  '2025-01-17-mongodb-nosql-database.md': {
    keywords: ["MongoDB", "NoSQL", "문서 데이터베이스", "JSON", "스키마리스", "집계", "인덱싱", "샤딩", "복제", "클러스터링"],
    description: "MongoDB를 사용하여 유연하고 확장 가능한 NoSQL 데이터베이스를 구축하는 방법을 알아봅니다. 문서 모델링, 집계 파이프라인, 인덱싱, 샤딩 등 MongoDB 핵심 개념을 학습하세요."
  },
  '2025-01-18-elasticsearch-search-engine.md': {
    keywords: ["Elasticsearch", "검색 엔진", "분산 검색", "인덱싱", "쿼리", "애그리게이션", "로그 분석", "ELK Stack", "Kibana", "Logstash"],
    description: "Elasticsearch를 사용하여 강력한 검색 기능과 로그 분석 시스템을 구축하는 방법을 알아봅니다. 인덱싱, 쿼리 최적화, 애그리게이션, ELK 스택 활용법을 학습하세요."
  },
  '2025-01-19-angular-framework.md': {
    keywords: ["Angular", "프론트엔드", "TypeScript", "컴포넌트", "서비스", "의존성 주입", "라우팅", "폼", "RxJS", "NgRx"],
    description: "Angular를 사용하여 엔터프라이즈급 프론트엔드 애플리케이션을 구축하는 방법을 알아봅니다. 컴포넌트, 서비스, 라우팅, 상태 관리 등 Angular 핵심 개념을 실습과 함께 학습하세요."
  },
  '2025-01-20-python-web-scraping.md': {
    keywords: ["Python", "웹 스크래핑", "BeautifulSoup", "Scrapy", "Selenium", "데이터 수집", "크롤링", "API", "자동화", "데이터 처리"],
    description: "Python을 사용하여 웹에서 데이터를 수집하고 처리하는 방법을 알아봅니다. BeautifulSoup, Scrapy, Selenium 등 다양한 스크래핑 도구와 기법을 실습과 함께 학습하세요."
  },
  '2025-01-21-react-native-mobile.md': {
    keywords: ["React Native", "모바일 앱", "크로스 플랫폼", "JavaScript", "네이티브", "하이브리드 앱", "iOS", "Android", "컴포넌트", "네비게이션"],
    description: "React Native를 사용하여 iOS와 Android에서 동작하는 모바일 애플리케이션을 개발하는 방법을 알아봅니다. 컴포넌트, 네비게이션, 네이티브 모듈 등 React Native 핵심 개념을 학습하세요."
  },
  '2025-01-22-flutter-app-development.md': {
    keywords: ["Flutter", "모바일 앱", "크로스 플랫폼", "Dart", "위젯", "Material Design", "Cupertino", "상태 관리", "네비게이션", "플랫폼 채널"],
    description: "Flutter를 사용하여 아름답고 성능 좋은 모바일 애플리케이션을 개발하는 방법을 알아봅니다. 위젯, 상태 관리, 네비게이션, 플랫폼 채널 등 Flutter 핵심 개념을 실습과 함께 학습하세요."
  },
  '2025-01-23-blockchain-basics.md': {
    keywords: ["블록체인", "Blockchain", "암호화폐", "스마트 컨트랙트", "분산원장", "합의 알고리즘", "이더리움", "Solidity", "DeFi", "NFT"],
    description: "블록체인의 기본 개념과 작동 원리를 이해하고, 스마트 컨트랙트 개발 방법을 알아봅니다. 분산원장, 합의 알고리즘, 이더리움, Solidity 등 블록체인 핵심 개념을 학습하세요."
  },
  '2025-01-24-notion-style-code-test.md': {
    keywords: ["Notion", "코드 블록", "문서화", "개발 도구", "마크다운", "API", "데이터베이스", "워크플로우", "협업", "지식 관리"],
    description: "Notion을 사용하여 개발 프로젝트를 문서화하고 관리하는 방법을 알아봅니다. 코드 블록, 데이터베이스, API 연동, 워크플로우 등 Notion의 개발 도구 활용법을 학습하세요."
  }
};

// 포스트 디렉토리 경로
const postsDir = path.join(__dirname, '..', 'posts');

// 파일 읽기 함수
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// 파일 쓰기 함수
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// frontmatter 파싱 함수
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;
  
  const frontmatter = frontmatterMatch[1];
  const lines = frontmatter.split('\n');
  const parsed = {};
  
  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // 배열 값 처리
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/"/g, ''));
      }
      // 문자열 값 처리
      else if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      parsed[key] = value;
    }
  });
  
  return parsed;
}

// frontmatter 생성 함수
function generateFrontmatter(data) {
  const lines = [];
  
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(item => `"${item}"`).join(', ')}]`);
    } else {
      lines.push(`${key}: "${value}"`);
    }
  });
  
  return `---\n${lines.join('\n')}\n---`;
}

// 메인 함수
function updatePosts() {
  const files = fs.readdirSync(postsDir);
  
  files.forEach(file => {
    if (!file.endsWith('.md')) return;
    
    const filePath = path.join(postsDir, file);
    const content = readFile(filePath);
    const frontmatter = parseFrontmatter(content);
    
    if (!frontmatter) return;
    
    // 해당 파일의 키워드와 설명 가져오기
    const seoData = postKeywords[file];
    if (!seoData) return;
    
    // frontmatter 업데이트
    frontmatter.keywords = seoData.keywords;
    frontmatter.description = seoData.description;
    
    // 새로운 frontmatter 생성
    const newFrontmatter = generateFrontmatter(frontmatter);
    
    // content에서 기존 frontmatter 제거하고 새로운 것으로 교체
    const newContent = content.replace(/^---\n[\s\S]*?\n---/, newFrontmatter);
    
    // 파일 쓰기
    writeFile(filePath, newContent);
    
    console.log(`Updated: ${file}`);
  });
}

// 스크립트 실행
updatePosts();
console.log('SEO update completed!'); 
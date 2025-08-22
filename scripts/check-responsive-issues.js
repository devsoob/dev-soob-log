#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 반응형 문제점 감지 규칙
const responsiveIssues = [
  {
    name: 'viewport-meta',
    description: 'viewport meta 태그 누락',
    check: async (page) => {
      const viewport = await page.$('meta[name="viewport"]');
      return viewport ? null : 'viewport meta 태그가 없습니다.';
    }
  },
  {
    name: 'touch-targets',
    description: '터치 타겟 크기 부족',
    check: async (page) => {
      const smallButtons = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
        const issues = [];
        
        buttons.forEach((button, index) => {
          const rect = button.getBoundingClientRect();
          // 스킵 링크(sr-only)와 숨겨진 요소는 제외
          if ((rect.width < 44 || rect.height < 44) && 
              rect.width > 0 && rect.height > 0 && // 실제로 보이는 요소만
              !button.classList.contains('sr-only') && 
              !button.textContent?.includes('메인 콘텐츠로 바로가기')) {
            issues.push({
              element: button.tagName + (button.className ? '.' + button.className.split(' ')[0] : ''),
              size: `${Math.round(rect.width)}×${Math.round(rect.height)}px`,
              text: button.textContent?.trim().substring(0, 30) || 'No text'
            });
          }
        });
        
        return issues;
      });
      
      return smallButtons.length > 0 ? 
        `${smallButtons.length}개의 터치 타겟이 44×44px보다 작습니다: ${JSON.stringify(smallButtons.slice(0, 3))}` : null;
    }
  },
  {
    name: 'font-size',
    description: '폰트 크기 부족',
    check: async (page) => {
      const smallTexts = await page.evaluate(() => {
        const elements = document.querySelectorAll('p, span, div, a, button, input, textarea');
        const issues = [];
        
        elements.forEach((element) => {
          const style = window.getComputedStyle(element);
          const fontSize = parseFloat(style.fontSize);
          // 스킵 링크와 특정 요소들은 제외
          if (fontSize < 16 && 
              element.textContent.trim().length > 0 && 
              !element.classList.contains('sr-only') &&
              !element.textContent?.includes('메인 콘텐츠로 바로가기') &&
              !element.classList.contains('text-xs') &&
              !element.classList.contains('text-sm')) {
            issues.push({
              element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : ''),
              fontSize: `${fontSize}px`,
              text: element.textContent.trim().substring(0, 30)
            });
          }
        });
        
        return issues;
      });
      
      return smallTexts.length > 0 ? 
        `${smallTexts.length}개의 요소가 16px보다 작은 폰트를 사용합니다: ${JSON.stringify(smallTexts.slice(0, 3))}` : null;
    }
  },
  {
    name: 'overflow-horizontal',
    description: '가로 스크롤 발생',
    check: async (page) => {
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      return hasOverflow ? '페이지에 가로 스크롤이 발생합니다.' : null;
    }
  },
  {
    name: 'image-responsive',
    description: '반응형 이미지 누락',
    check: async (page) => {
      const nonResponsiveImages = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const issues = [];
        
        images.forEach((img) => {
          if (!img.style.maxWidth && !img.style.width && !img.classList.contains('responsive')) {
            const rect = img.getBoundingClientRect();
            if (rect.width > 0) {
              issues.push({
                src: img.src.split('/').pop(),
                width: `${Math.round(rect.width)}px`,
                hasMaxWidth: !!img.style.maxWidth,
                hasResponsiveClass: img.classList.contains('responsive')
              });
            }
          }
        });
        
        return issues;
      });
      
      return nonResponsiveImages.length > 0 ? 
        `${nonResponsiveImages.length}개의 이미지가 반응형 설정이 없습니다: ${JSON.stringify(nonResponsiveImages.slice(0, 3))}` : null;
    }
  },
  {
    name: 'table-responsive',
    description: '반응형 테이블 누락',
    check: async (page) => {
      const tables = await page.evaluate(() => {
        const tables = document.querySelectorAll('table');
        const issues = [];
        
        tables.forEach((table) => {
          const rect = table.getBoundingClientRect();
          if (rect.width > 0 && !table.classList.contains('responsive') && !table.parentElement.classList.contains('table-responsive')) {
            issues.push({
              element: table.tagName + (table.className ? '.' + table.className.split(' ')[0] : ''),
              width: `${Math.round(rect.width)}px`
            });
          }
        });
        
        return issues;
      });
      
      return tables.length > 0 ? 
        `${tables.length}개의 테이블이 반응형 설정이 없습니다: ${JSON.stringify(tables)}` : null;
    }
  },
  {
    name: 'media-queries',
    description: '미디어 쿼리 사용 확인',
    check: async (page) => {
      const mediaQueries = await page.evaluate(() => {
        const styles = Array.from(document.styleSheets);
        let mediaQueryCount = 0;
        let responsiveClasses = 0;
        let hasTailwind = false;
        
        // CSS 규칙에서 미디어 쿼리 확인
        styles.forEach(styleSheet => {
          try {
            const rules = Array.from(styleSheet.cssRules || []);
            rules.forEach(rule => {
              if (rule instanceof CSSMediaRule) {
                mediaQueryCount++;
              }
            });
          } catch (e) {
            // CORS 오류 무시
          }
        });
        
        // Tailwind CSS 사용 여부 확인
        const head = document.head;
        const links = head.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
          if (link.href.includes('tailwind') || link.href.includes('css')) {
            hasTailwind = true;
          }
        });
        
        // Tailwind CSS 클래스에서 반응형 클래스 확인
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
          if (element.className && typeof element.className === 'string') {
            const classes = element.className.split(' ');
            classes.forEach(cls => {
              if (cls.includes('sm:') || cls.includes('md:') || cls.includes('lg:') || cls.includes('xl:') || cls.includes('2xl:')) {
                responsiveClasses++;
              }
            });
          }
        });
        
        // 컴퓨티드 스타일에서 미디어 쿼리 확인
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        const hasResponsiveStyles = computedStyle.getPropertyValue('--tw-breakpoint') || 
                                   computedStyle.getPropertyValue('--tw-container') ||
                                   body.classList.contains('dark') ||
                                   body.classList.contains('light');
        
        return { 
          mediaQueryCount, 
          responsiveClasses, 
          hasTailwind, 
          hasResponsiveStyles,
          totalElements: elements.length 
        };
      });
      
      // Tailwind CSS를 사용하거나 반응형 클래스가 있으면 OK
      if (mediaQueries.mediaQueryCount === 0 && 
          mediaQueries.responsiveClasses === 0 && 
          !mediaQueries.hasTailwind && 
          !mediaQueries.hasResponsiveStyles) {
        return '미디어 쿼리나 반응형 클래스가 사용되지 않았습니다.';
      }
      
      return null;
    }
  },
  {
    name: 'clickable-elements',
    description: '클릭 가능한 요소 접근성 확인',
    check: async (page) => {
      const clickableIssues = await page.evaluate(() => {
        const clickableElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"], [role="button"]');
        const issues = [];
        
        clickableElements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          
          // 화면 밖으로 나간 요소 확인
          if (rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) {
            issues.push({
              element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : ''),
              issue: '화면 밖으로 나간 클릭 가능한 요소',
              position: `left: ${Math.round(rect.left)}, top: ${Math.round(rect.top)}`
            });
          }
          
          // 투명하거나 보이지 않는 요소 확인
          if (style.opacity === '0' || style.visibility === 'hidden' || style.display === 'none') {
            issues.push({
              element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : ''),
              issue: '보이지 않는 클릭 가능한 요소',
              opacity: style.opacity,
              visibility: style.visibility,
              display: style.display
            });
          }
        });
        
        return issues;
      });
      
      return clickableIssues.length > 0 ? 
        `${clickableIssues.length}개의 클릭 가능한 요소에 접근성 문제가 있습니다: ${JSON.stringify(clickableIssues.slice(0, 3))}` : null;
    }
  },
  {
    name: 'navigation-menu',
    description: '네비게이션 메뉴 반응형 확인',
    check: async (page) => {
      const navIssues = await page.evaluate(() => {
        const navs = document.querySelectorAll('nav, [role="navigation"]');
        const issues = [];
        
        navs.forEach((nav) => {
          const rect = nav.getBoundingClientRect();
          const style = window.getComputedStyle(nav);
          
          // 모바일에서 네비게이션이 너무 작은 경우
          if (window.innerWidth <= 768 && rect.height < 50) {
            issues.push({
              element: nav.tagName + (nav.className ? '.' + nav.className.split(' ')[0] : ''),
              issue: '모바일에서 네비게이션 높이가 너무 작음',
              height: `${Math.round(rect.height)}px`
            });
          }
          
          // 네비게이션 내부 링크들이 겹치는 경우
          const navLinks = nav.querySelectorAll('a, button');
          navLinks.forEach((link, index) => {
            const linkRect = link.getBoundingClientRect();
            navLinks.forEach((otherLink, otherIndex) => {
              if (index !== otherIndex) {
                const otherRect = otherLink.getBoundingClientRect();
                if (linkRect.left < otherRect.right && linkRect.right > otherRect.left &&
                    linkRect.top < otherRect.bottom && linkRect.bottom > otherRect.top) {
                  issues.push({
                    element: '네비게이션 링크',
                    issue: '네비게이션 링크들이 겹침',
                    link1: link.textContent?.trim().substring(0, 20),
                    link2: otherLink.textContent?.trim().substring(0, 20)
                  });
                }
              }
            });
          });
        });
        
        return issues;
      });
      
      return navIssues.length > 0 ? 
        `${navIssues.length}개의 네비게이션 문제가 발견되었습니다: ${JSON.stringify(navIssues.slice(0, 3))}` : null;
    }
  },
  {
    name: 'content-overflow',
    description: '콘텐츠 오버플로우 확인',
    check: async (page) => {
      const overflowIssues = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const issues = [];
        
        elements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          
          // 부모 요소보다 큰 자식 요소 확인
          if (element.parentElement) {
            const parentRect = element.parentElement.getBoundingClientRect();
            if (rect.width > parentRect.width && style.overflow !== 'hidden') {
              issues.push({
                element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : ''),
                issue: '부모 요소보다 큰 자식 요소',
                childWidth: `${Math.round(rect.width)}px`,
                parentWidth: `${Math.round(parentRect.width)}px`
              });
            }
          }
          
          // 긴 텍스트가 컨테이너를 벗어나는 경우
          if (element.textContent && element.textContent.length > 100) {
            const textWidth = element.scrollWidth;
            if (textWidth > rect.width) {
              issues.push({
                element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : ''),
                issue: '긴 텍스트가 컨테이너를 벗어남',
                textLength: element.textContent.length,
                containerWidth: `${Math.round(rect.width)}px`,
                textWidth: `${Math.round(textWidth)}px`
              });
            }
          }
        });
        
        return issues;
      });
      
      return overflowIssues.length > 0 ? 
        `${overflowIssues.length}개의 콘텐츠 오버플로우 문제가 발견되었습니다: ${JSON.stringify(overflowIssues.slice(0, 3))}` : null;
    }
  }
];

// 테스트할 디바이스 설정 (간소화)
const testDevices = [
  { name: 'Mobile Small', width: 320, height: 568 },
  { name: 'Mobile Medium', width: 375, height: 667 },
  { name: 'Mobile Large', width: 414, height: 896 },
  { name: 'Tablet Small', width: 768, height: 1024 },
  { name: 'Tablet Large', width: 1024, height: 1366 },
  { name: 'Desktop Small', width: 1280, height: 720 },
  { name: 'Desktop Medium', width: 1440, height: 900 },
  { name: 'Desktop Large', width: 1920, height: 1080 }
];

// 테스트할 페이지들
const testPages = [
  { path: '/', name: '메인 페이지' },
  { path: '/posts', name: '포스트 목록' },
  { path: '/about', name: '소개 페이지' },
  { path: '/posts/getting-started-with-react', name: 'React 시작하기 포스트' },
  { path: '/posts/typescript-basics', name: 'TypeScript 기초 포스트' },
  { path: '/posts/nodejs-backend-development', name: 'Node.js 백엔드 개발 포스트' },
  { path: '/posts/notion-style-code-test', name: 'Notion 스타일 코드 테스트 포스트' }
];

async function checkResponsiveIssues() {
  console.log('🔍 반응형 디자인 문제점 감지 시작...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = [];
  
  try {
    for (const device of testDevices) {
      console.log(`📱 ${device.name} 디바이스 테스트 중...`);
      
      for (const pageInfo of testPages) {
        const page = await browser.newPage();
        
        try {
          await page.setViewport({ width: device.width, height: device.height });
          
          // 페이지 로딩
          await page.goto(`http://localhost:3000${pageInfo.path}`, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
          });
          
          // 각 문제점 체크
          const pageIssues = [];
          
          for (const issue of responsiveIssues) {
            try {
              const result = await issue.check(page);
              if (result) {
                pageIssues.push({
                  type: issue.name,
                  description: issue.description,
                  details: result
                });
              }
            } catch (error) {
              console.error(`❌ ${issue.name} 체크 중 오류:`, error.message);
            }
          }
          
          results.push({
            device: device.name,
            page: pageInfo.name,
            path: pageInfo.path,
            viewport: `${device.width}×${device.height}`,
            issues: pageIssues,
            timestamp: new Date().toISOString()
          });
          
          console.log(`  ${pageIssues.length > 0 ? '❌' : '✅'} ${pageInfo.name}: ${pageIssues.length}개 문제 발견`);
          
        } catch (error) {
          console.error(`❌ ${device.name} - ${pageInfo.name} 테스트 실패:`, error.message);
        } finally {
          await page.close();
        }
      }
    }
    
    // 결과 저장
    const resultsDir = path.join(__dirname, '../mobile-test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const resultsPath = path.join(resultsDir, 'responsive-issues.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    
    // 요약 리포트 생성
    generateIssuesReport(results);
    
    console.log('\n✅ 반응형 문제점 감지 완료!');
    console.log(`📊 결과 저장 위치: ${resultsPath}`);
    console.log(`📄 HTML 리포트: ${path.join(resultsDir, 'responsive-issues-report.html')}`);
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
  } finally {
    await browser.close();
  }
}

function generateIssuesReport(results) {
  const totalIssues = results.reduce((sum, result) => sum + result.issues.length, 0);
  const devicesWithIssues = results.filter(r => r.issues.length > 0).length;
  
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>반응형 디자인 문제점 리포트</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; padding: 20px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; border-radius: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .summary-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .summary-card h3 { color: #ff6b6b; margin-bottom: 10px; }
        .issue-section { margin-bottom: 40px; }
        .issue-header { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .issue-header h2 { color: #495057; }
        .issue-item { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 15px; }
        .issue-content { padding: 15px; }
        .issue-type { font-weight: bold; color: #ff6b6b; margin-bottom: 5px; }
        .issue-description { color: #495057; margin-bottom: 10px; }
        .issue-details { background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 0.9em; }
        .no-issues { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; text-align: center; }
        .timestamp { text-align: center; color: #6c757d; font-size: 0.9em; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 반응형 디자인 문제점 리포트</h1>
            <p>다양한 디바이스에서 발견된 반응형 디자인 문제점</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>📊 문제점 통계</h3>
                <p>총 문제점: ${totalIssues}개</p>
                <p>문제가 있는 페이지: ${devicesWithIssues}개</p>
                <p>테스트 디바이스: ${testDevices.length}개</p>
            </div>
            <div class="summary-card">
                <h3>📱 테스트 디바이스</h3>
                ${testDevices.map(device => `<p>• ${device.name} (${device.width}×${device.height})</p>`).join('')}
            </div>
            <div class="summary-card">
                <h3>⏱️ 테스트 시간</h3>
                <p>${new Date().toLocaleString('ko-KR')}</p>
            </div>
        </div>
        
        ${results.map(result => `
            <div class="issue-section">
                <div class="issue-header">
                    <h2>📱 ${result.device} - ${result.page}</h2>
                    <p>뷰포트: ${result.viewport} | 문제점: ${result.issues.length}개</p>
                </div>
                
                ${result.issues.length === 0 ? 
                    '<div class="no-issues">✅ 문제점이 발견되지 않았습니다!</div>' :
                    result.issues.map(issue => `
                        <div class="issue-item">
                            <div class="issue-content">
                                <div class="issue-type">${issue.type}</div>
                                <div class="issue-description">${issue.description}</div>
                                <div class="issue-details">${issue.details}</div>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        `).join('')}
        
        <div class="timestamp">
            리포트 생성 시간: ${new Date().toLocaleString('ko-KR')}
        </div>
    </div>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, '../mobile-test-results/responsive-issues-report.html'), html);
}

// 스크립트 실행
if (require.main === module) {
  checkResponsiveIssues().catch(console.error);
}

module.exports = { checkResponsiveIssues, responsiveIssues }; 
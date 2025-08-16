#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 테스트할 디바이스 설정
const devices = [
  {
    name: 'iPhone SE',
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'iPhone 12 Pro',
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'iPhone 12 Pro Max',
    viewport: { width: 428, height: 926 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'iPad',
    viewport: { width: 768, height: 1024 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'iPad Pro',
    viewport: { width: 1024, height: 1366 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'Samsung Galaxy S20',
    viewport: { width: 360, height: 800 },
    userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36'
  },
  {
    name: 'Samsung Galaxy Tab S7',
    viewport: { width: 800, height: 1280 },
    userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36'
  }
];

// 테스트할 페이지들
const pages = [
  { path: '/', name: '메인 페이지' },
  { path: '/posts', name: '포스트 목록' },
  { path: '/about', name: '소개 페이지' },
  { path: '/tags', name: '태그 페이지' },
  { path: '/categories', name: '카테고리 페이지' }
];

// 테스트 결과 저장 디렉토리
const resultsDir = path.join(__dirname, '../mobile-test-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

async function takeScreenshot(page, device, pageInfo, browser) {
  const screenshotPath = path.join(resultsDir, `${device.name}-${pageInfo.name.replace(/\s+/g, '-')}.png`);
  
  try {
    await page.setViewport(device.viewport);
    await page.setUserAgent(device.userAgent);
    
    // 페이지 로딩 대기
    await page.goto(`http://localhost:3000${pageInfo.path}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // 추가 대기 시간 (애니메이션 완료 등)
    await page.waitForTimeout(2000);
    
    // 스크린샷 촬영
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true,
      quality: 80
    });
    
    console.log(`✅ ${device.name} - ${pageInfo.name} 스크린샷 완료: ${screenshotPath}`);
    
    // 페이지 성능 메트릭 수집
    const metrics = await page.metrics();
    const performance = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
    
    return {
      device: device.name,
      page: pageInfo.name,
      path: pageInfo.path,
      screenshot: screenshotPath,
      metrics: {
        ...metrics,
        ...performance
      },
      viewport: device.viewport,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`❌ ${device.name} - ${pageInfo.name} 스크린샷 실패:`, error.message);
    return {
      device: device.name,
      page: pageInfo.name,
      path: pageInfo.path,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function testResponsiveDesign() {
  console.log('🚀 모바일 반응형 테스트 시작...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = [];
  
  try {
    for (const device of devices) {
      console.log(`📱 ${device.name} 테스트 중...`);
      
      for (const pageInfo of pages) {
        const page = await browser.newPage();
        
        // 네트워크 요청 모니터링
        page.on('request', request => {
          console.log(`  📡 ${request.method()} ${request.url()}`);
        });
        
        page.on('requestfailed', request => {
          console.log(`  ❌ 요청 실패: ${request.url()}`);
        });
        
        const result = await takeScreenshot(page, device, pageInfo, browser);
        results.push(result);
        
        await page.close();
      }
    }
    
    // 결과를 JSON 파일로 저장
    const resultsPath = path.join(resultsDir, 'test-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    
    // HTML 리포트 생성
    generateHTMLReport(results);
    
    console.log('\n✅ 모바일 반응형 테스트 완료!');
    console.log(`📊 결과 저장 위치: ${resultsDir}`);
    console.log(`📄 HTML 리포트: ${path.join(resultsDir, 'report.html')}`);
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
  } finally {
    await browser.close();
  }
}

function generateHTMLReport(results) {
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>모바일 반응형 테스트 리포트</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .summary-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .summary-card h3 { color: #667eea; margin-bottom: 10px; }
        .device-section { margin-bottom: 40px; }
        .device-header { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .device-header h2 { color: #495057; }
        .screenshots { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .screenshot-item { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .screenshot-item img { width: 100%; height: auto; display: block; }
        .screenshot-info { padding: 15px; }
        .screenshot-info h4 { color: #495057; margin-bottom: 8px; }
        .metrics { font-size: 0.9em; color: #6c757d; }
        .error { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-top: 10px; }
        .success { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-top: 10px; }
        .timestamp { text-align: center; color: #6c757d; font-size: 0.9em; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 모바일 반응형 테스트 리포트</h1>
            <p>다양한 디바이스에서의 UI/UX 테스트 결과</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>📊 테스트 통계</h3>
                <p>총 테스트: ${results.length}개</p>
                <p>성공: ${results.filter(r => !r.error).length}개</p>
                <p>실패: ${results.filter(r => r.error).length}개</p>
            </div>
            <div class="summary-card">
                <h3>📱 테스트 디바이스</h3>
                <p>${devices.length}개 디바이스</p>
                <p>${pages.length}개 페이지</p>
            </div>
            <div class="summary-card">
                <h3>⏱️ 테스트 시간</h3>
                <p>${new Date().toLocaleString('ko-KR')}</p>
            </div>
        </div>
        
        ${generateDeviceSections(results)}
        
        <div class="timestamp">
            리포트 생성 시간: ${new Date().toLocaleString('ko-KR')}
        </div>
    </div>
</body>
</html>`;

  fs.writeFileSync(path.join(resultsDir, 'report.html'), html);
}

function generateDeviceSections(results) {
  const deviceGroups = {};
  
  results.forEach(result => {
    if (!deviceGroups[result.device]) {
      deviceGroups[result.device] = [];
    }
    deviceGroups[result.device].push(result);
  });
  
  return Object.entries(deviceGroups).map(([device, deviceResults]) => `
    <div class="device-section">
        <div class="device-header">
            <h2>📱 ${device}</h2>
        </div>
        <div class="screenshots">
            ${deviceResults.map(result => `
                <div class="screenshot-item">
                    ${result.error ? 
                        `<div class="screenshot-info">
                            <h4>${result.page}</h4>
                            <div class="error">❌ 오류: ${result.error}</div>
                        </div>` :
                        `<img src="${path.basename(result.screenshot)}" alt="${result.page} 스크린샷">
                        <div class="screenshot-info">
                            <h4>${result.page}</h4>
                            <div class="metrics">
                                <p>📏 뷰포트: ${result.viewport.width} × ${result.viewport.height}</p>
                                ${result.metrics ? `
                                    <p>⚡ 로드 시간: ${Math.round(result.metrics.loadTime)}ms</p>
                                    <p>🎨 첫 페인트: ${Math.round(result.metrics.firstPaint)}ms</p>
                                ` : ''}
                            </div>
                            <div class="success">✅ 성공</div>
                        </div>`
                    }
                </div>
            `).join('')}
        </div>
    </div>
  `).join('');
}

// 스크립트 실행
if (require.main === module) {
  testResponsiveDesign().catch(console.error);
}

module.exports = { testResponsiveDesign, devices, pages }; 
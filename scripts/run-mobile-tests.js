#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 테스트 결과 디렉토리
const resultsDir = path.join(__dirname, '../mobile-test-results');

// ANSI 색상 코드
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, description) {
  log(`\n${colors.cyan}${step}${colors.reset} ${description}`, 'bright');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// 개발 서버 시작
function startDevServer() {
  return new Promise((resolve, reject) => {
    logStep('1', '개발 서버 시작 중...');
    
    const devProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true
    });
    
    let serverReady = false;
    
    devProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Ready') || output.includes('started server')) {
        if (!serverReady) {
          serverReady = true;
          logSuccess('개발 서버가 시작되었습니다.');
          resolve(devProcess);
        }
      }
    });
    
    devProcess.stderr.on('data', (data) => {
      const error = data.toString();
      if (error.includes('Error') || error.includes('EADDRINUSE')) {
        logError(`서버 시작 오류: ${error}`);
        reject(new Error(error));
      }
    });
    
    // 30초 후 타임아웃
    setTimeout(() => {
      if (!serverReady) {
        devProcess.kill();
        reject(new Error('서버 시작 타임아웃'));
      }
    }, 30000);
  });
}

// 테스트 실행
function runTest(testName, testCommand) {
  return new Promise((resolve, reject) => {
    logStep('2', `${testName} 실행 중...`);
    
    const testProcess = spawn('node', [testCommand], {
      stdio: 'inherit',
      shell: true
    });
    
    testProcess.on('close', (code) => {
      if (code === 0) {
        logSuccess(`${testName} 완료`);
        resolve();
      } else {
        logError(`${testName} 실패 (종료 코드: ${code})`);
        reject(new Error(`${testName} 실패`));
      }
    });
    
    testProcess.on('error', (error) => {
      logError(`${testName} 실행 오류: ${error.message}`);
      reject(error);
    });
  });
}

// 서버 종료
function stopDevServer(devProcess) {
  return new Promise((resolve) => {
    logStep('3', '개발 서버 종료 중...');
    
    if (devProcess && !devProcess.killed) {
      devProcess.kill('SIGTERM');
      
      setTimeout(() => {
        if (!devProcess.killed) {
          devProcess.kill('SIGKILL');
        }
        logSuccess('개발 서버가 종료되었습니다.');
        resolve();
      }, 5000);
    } else {
      resolve();
    }
  });
}

// 결과 요약 생성
function generateSummary() {
  logStep('4', '테스트 결과 요약 생성 중...');
  
  const summary = {
    timestamp: new Date().toISOString(),
    tests: {
      mobileResponsive: {
        name: '모바일 반응형 테스트',
        status: 'completed',
        results: []
      },
      responsiveIssues: {
        name: '반응형 문제점 감지',
        status: 'completed',
        results: []
      }
    }
  };
  
  // 결과 파일들 확인
  const files = [
    { name: 'test-results.json', test: 'mobileResponsive' },
    { name: 'responsive-issues.json', test: 'responsiveIssues' }
  ];
  
  files.forEach(file => {
    const filePath = path.join(resultsDir, file.name);
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        summary.tests[file.test].results = data;
        logSuccess(`${file.name} 결과 로드됨`);
      } catch (error) {
        logError(`${file.name} 결과 로드 실패: ${error.message}`);
      }
    } else {
      logWarning(`${file.name} 결과 파일이 없습니다.`);
    }
  });
  
  // 요약 저장
  const summaryPath = path.join(resultsDir, 'test-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  // HTML 요약 리포트 생성
  generateSummaryReport(summary);
  
  logSuccess('테스트 요약이 생성되었습니다.');
  return summary;
}

function generateSummaryReport(summary) {
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>모바일 반응형 테스트 종합 리포트</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .summary-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .summary-card h3 { color: #667eea; margin-bottom: 15px; font-size: 1.3rem; }
        .test-section { background: white; border-radius: 12px; padding: 25px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .test-section h2 { color: #495057; margin-bottom: 20px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px; }
        .status-badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: bold; }
        .status-completed { background: #d4edda; color: #155724; }
        .status-failed { background: #f8d7da; color: #721c24; }
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
        .metric { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; }
        .metric-value { font-size: 1.5rem; font-weight: bold; color: #667eea; }
        .metric-label { font-size: 0.9rem; color: #6c757d; margin-top: 5px; }
        .timestamp { text-align: center; color: #6c757d; font-size: 0.9rem; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; }
        .links { margin-top: 20px; }
        .link-btn { display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin-right: 10px; margin-bottom: 10px; }
        .link-btn:hover { background: #5a6fd8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 모바일 반응형 테스트 종합 리포트</h1>
            <p>다양한 디바이스에서의 UI/UX 테스트 결과 요약</p>
        </div>
        
        <div class="summary-grid">
            <div class="summary-card">
                <h3>📊 테스트 개요</h3>
                <p><strong>실행 시간:</strong> ${new Date(summary.timestamp).toLocaleString('ko-KR')}</p>
                <p><strong>총 테스트:</strong> ${Object.keys(summary.tests).length}개</p>
                <p><strong>완료된 테스트:</strong> ${Object.values(summary.tests).filter(t => t.status === 'completed').length}개</p>
            </div>
            
            <div class="summary-card">
                <h3>🔗 관련 리포트</h3>
                <div class="links">
                    <a href="report.html" class="link-btn">📱 반응형 테스트</a>
                    <a href="responsive-issues-report.html" class="link-btn">🔍 문제점 감지</a>
                </div>
            </div>
        </div>
        
        ${Object.entries(summary.tests).map(([key, test]) => `
            <div class="test-section">
                <h2>
                    ${test.name}
                    <span class="status-badge status-${test.status}">${test.status === 'completed' ? '완료' : '실패'}</span>
                </h2>
                
                ${test.results && test.results.length > 0 ? `
                    <div class="metric-grid">
                        <div class="metric">
                            <div class="metric-value">${test.results.length}</div>
                            <div class="metric-label">총 테스트</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${test.results.filter(r => !r.error && (!r.issues || r.issues.length === 0)).length}</div>
                            <div class="metric-label">성공</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${test.results.filter(r => r.error || (r.issues && r.issues.length > 0)).length}</div>
                            <div class="metric-label">문제 발견</div>
                        </div>
                    </div>
                ` : '<p>테스트 결과가 없습니다.</p>'}
            </div>
        `).join('')}
        
        <div class="timestamp">
            리포트 생성 시간: ${new Date().toLocaleString('ko-KR')}
        </div>
    </div>
</body>
</html>`;

  fs.writeFileSync(path.join(resultsDir, 'summary-report.html'), html);
}

// 메인 실행 함수
async function runAllTests() {
  let devProcess = null;
  
  try {
    log('🚀 모바일 반응형 종합 테스트 시작', 'bright');
    log('=' * 50, 'cyan');
    
    // 1. 개발 서버 시작
    devProcess = await startDevServer();
    
    // 2. 잠시 대기 (서버 안정화)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 3. 테스트 실행
    await runTest('모바일 반응형 테스트', 'scripts/mobile-responsive-test.js');
    await runTest('반응형 문제점 감지', 'scripts/check-responsive-issues.js');
    
    // 4. 서버 종료
    await stopDevServer(devProcess);
    
    // 5. 결과 요약 생성
    const summary = generateSummary();
    
    // 6. 최종 결과 출력
    log('\n' + '=' * 50, 'cyan');
    log('🎉 모든 테스트가 완료되었습니다!', 'bright');
    log('=' * 50, 'cyan');
    
    logInfo(`📁 결과 저장 위치: ${resultsDir}`);
    logInfo(`📄 종합 리포트: ${path.join(resultsDir, 'summary-report.html')}`);
    logInfo(`📱 반응형 테스트: ${path.join(resultsDir, 'report.html')}`);
    logInfo(`🔍 문제점 감지: ${path.join(resultsDir, 'responsive-issues-report.html')}`);
    
    // 결과 통계 출력
    if (summary.tests.mobileResponsive.results) {
      const mobileResults = summary.tests.mobileResponsive.results;
      const successCount = mobileResults.filter(r => !r.error).length;
      const totalCount = mobileResults.length;
      
      logSuccess(`모바일 반응형 테스트: ${successCount}/${totalCount} 성공`);
    }
    
    if (summary.tests.responsiveIssues.results) {
      const issueResults = summary.tests.responsiveIssues.results;
      const issuesCount = issueResults.reduce((sum, r) => sum + r.issues.length, 0);
      
      if (issuesCount === 0) {
        logSuccess('반응형 문제점: 발견되지 않음');
      } else {
        logWarning(`반응형 문제점: ${issuesCount}개 발견`);
      }
    }
    
  } catch (error) {
    logError(`테스트 실행 중 오류 발생: ${error.message}`);
    
    // 서버 정리
    if (devProcess) {
      await stopDevServer(devProcess);
    }
    
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests }; 
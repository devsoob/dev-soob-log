const fs = require('fs');
const path = require('path');

// SVG 파일을 읽어서 PNG로 변환하는 함수
async function generateOGImage() {
  try {
    const svgPath = path.join(process.cwd(), 'public', 'og-image.svg');
    const pngPath = path.join(process.cwd(), 'public', 'og-image.png');
    
    // SVG 파일이 존재하는지 확인
    if (!fs.existsSync(svgPath)) {
      console.error('SVG 파일을 찾을 수 없습니다:', svgPath);
      return;
    }
    
    // Puppeteer를 사용하여 SVG를 PNG로 변환
    const puppeteer = require('puppeteer');
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // SVG 파일을 읽어서 페이지에 로드
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    await page.setContent(svgContent);
    
    // 뷰포트 설정 (1200x630)
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
    });
    
    // PNG로 스크린샷 찍기
    await page.screenshot({
      path: pngPath,
      type: 'png',
      fullPage: false,
      omitBackground: false
    });
    
    await browser.close();
    
    console.log('✅ OG 이미지가 성공적으로 생성되었습니다:', pngPath);
    
  } catch (error) {
    console.error('❌ OG 이미지 생성 중 오류가 발생했습니다:', error);
    
    // Puppeteer가 설치되지 않은 경우 대안 제공
    console.log('\n💡 대안: 수동으로 SVG를 PNG로 변환하세요:');
    console.log('1. https://convertio.co/svg-png/ 또는 https://cloudconvert.com/svg-to-png');
    console.log('2. SVG 파일을 업로드하고 1200x630 크기로 변환');
    console.log('3. 결과 파일을 public/og-image.png로 저장');
  }
}

// 스크립트 실행
generateOGImage(); 
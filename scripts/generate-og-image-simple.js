const fs = require('fs');
const path = require('path');

// Canvas를 사용하여 OG 이미지 생성
async function generateOGImage() {
  try {
    // Canvas 모듈 로드
    const { createCanvas, registerFont } = require('canvas');
    
    // 캔버스 생성 (1200x630)
    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');
    
    // 배경 그라데이션 생성 (슬레이트 그레이)
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);
    
    // 액센트 그라데이션
    const accentGradient = ctx.createLinearGradient(0, 0, 200, 0);
    accentGradient.addColorStop(0, '#3b82f6');
    accentGradient.addColorStop(1, '#8b5cf6');
    
    // 좌측 상단 장식 원
    ctx.fillStyle = accentGradient;
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(100, 100, 60, 0, 2 * Math.PI);
    ctx.fill();
    
    // 우측 하단 장식 원
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.arc(1100, 530, 100, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(1100, 530, 70, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // 로고 (둥근 사각형)
    ctx.fillStyle = accentGradient;
    ctx.beginPath();
    ctx.moveTo(420, 195);
    ctx.lineTo(460, 195);
    ctx.quadraticCurveTo(480, 195, 480, 215);
    ctx.lineTo(480, 255);
    ctx.quadraticCurveTo(480, 275, 460, 275);
    ctx.lineTo(420, 275);
    ctx.quadraticCurveTo(400, 275, 400, 255);
    ctx.lineTo(400, 215);
    ctx.quadraticCurveTo(400, 195, 420, 195);
    ctx.closePath();
    ctx.fill();
    
    // 로고 텍스트
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DS', 440, 235);
    
    // 메인 타이틀 (더 큰 폰트)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Dev Soob Log', 600, 315);
    
    // 서브 타이틀
    ctx.fillStyle = '#94a3b8';
    ctx.font = '28px Arial';
    ctx.fillText('개발 경험과 지식을 공유하는 블로그', 600, 375);
    
    // 기술 스택
    ctx.fillStyle = '#64748b';
    ctx.font = '20px Arial';
    ctx.fillText('Flutter • React • Next.js • TypeScript', 600, 435);
    
    // 하단 장식선
    ctx.fillStyle = accentGradient;
    ctx.fillRect(450, 580, 300, 2);
    
    // 우측 상단 작은 장식
    ctx.fillStyle = '#3b82f6';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(1100, 80, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(1120, 80, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(1135, 80, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // 좌측 하단 작은 장식
    ctx.fillStyle = accentGradient;
    ctx.fillRect(120, 550, 3, 20);
    ctx.fillRect(128, 550, 3, 15);
    ctx.fillRect(136, 550, 3, 25);
    
    // PNG로 저장
    const buffer = canvas.toBuffer('image/png');
    const outputPath = path.join(process.cwd(), 'public', 'og-image.png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log('✅ OG 이미지가 성공적으로 생성되었습니다:', outputPath);
    
  } catch (error) {
    console.error('❌ OG 이미지 생성 중 오류가 발생했습니다:', error);
    
    // Canvas가 설치되지 않은 경우 대안 제공
    console.log('\n💡 대안: 수동으로 SVG를 PNG로 변환하세요:');
    console.log('1. https://convertio.co/svg-png/ 또는 https://cloudconvert.com/svg-to-png');
    console.log('2. public/og-image.svg 파일을 업로드하고 1200x630 크기로 변환');
    console.log('3. 결과 파일을 public/og-image.png로 저장');
    
    // 또는 Canvas 설치 안내
    console.log('\n💡 또는 Canvas 모듈을 설치하세요:');
    console.log('npm install --save-dev canvas');
  }
}

// 스크립트 실행
generateOGImage(); 
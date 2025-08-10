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
    
    // 배경 그라데이션 생성
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#2d2d2d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);
    
    // 액센트 그라데이션
    const accentGradient = ctx.createLinearGradient(0, 0, 200, 0);
    accentGradient.addColorStop(0, '#3b82f6');
    accentGradient.addColorStop(1, '#8b5cf6');
    
    // 로고 원 그리기
    ctx.beginPath();
    ctx.arc(160, 210, 60, 0, 2 * Math.PI);
    ctx.fillStyle = accentGradient;
    ctx.fill();
    
    // 로고 텍스트
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DS', 160, 210);
    
    // 기술 스택 아이콘들
    const techIcons = [
      { x: 240, y: 170, color: '#61dafb', text: 'R' },
      { x: 270, y: 170, color: '#02569b', text: 'F' },
      { x: 300, y: 170, color: '#339933', text: 'N' }
    ];
    
    techIcons.forEach(icon => {
      ctx.beginPath();
      ctx.arc(icon.x, icon.y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = icon.color;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.globalAlpha = 1;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon.text, icon.x, icon.y);
    });
    
    // 메인 타이틀
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Dev Soob Log', 600, 280);
    
    // 서브 타이틀
    ctx.fillStyle = '#9ca3af';
    ctx.font = '24px Arial';
    ctx.fillText('개발 경험과 지식을 공유하는 블로그', 600, 330);
    
    // 기술 스택
    ctx.fillStyle = '#6b7280';
    ctx.font = '18px Arial';
    ctx.fillText('Flutter • React • Next.js • TypeScript', 600, 400);
    
    // 하단 장식선
    ctx.fillStyle = accentGradient;
    ctx.fillRect(500, 550, 200, 3);
    
    // 코너 장식
    ctx.fillStyle = '#3b82f6';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(1100, 50, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(1125, 50, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(1145, 50, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // 좌측 하단 장식
    ctx.fillStyle = accentGradient;
    ctx.fillRect(100, 580, 4, 30);
    ctx.fillRect(110, 580, 4, 20);
    ctx.fillRect(120, 580, 4, 35);
    
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
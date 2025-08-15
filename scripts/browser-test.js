// 브라우저 호환성 테스트 스크립트
console.log('=== 브라우저 호환성 테스트 시작 ===');

// 1. 기본 JavaScript 기능 테스트
console.log('1. 기본 JavaScript 기능 테스트:');
console.log('- ES6+ 지원:', typeof Promise !== 'undefined' ? '✅' : '❌');
console.log('- Arrow functions:', (() => 'test')() === 'test' ? '✅' : '❌');
console.log('- Template literals:', `test ${1 + 1}` === 'test 2' ? '✅' : '❌');
console.log('- Destructuring:', (() => { const {a} = {a: 1}; return a; })() === 1 ? '✅' : '❌');

// 2. DOM API 테스트
console.log('\n2. DOM API 테스트:');
console.log('- querySelector:', typeof document.querySelector === 'function' ? '✅' : '❌');
console.log('- addEventListener:', typeof document.addEventListener === 'function' ? '✅' : '❌');
console.log('- classList:', typeof document.body.classList === 'object' ? '✅' : '❌');

// 3. CSS Grid/Flexbox 지원 테스트
console.log('\n3. CSS 지원 테스트:');
const testElement = document.createElement('div');
testElement.style.display = 'grid';
console.log('- CSS Grid:', testElement.style.display === 'grid' ? '✅' : '❌');
testElement.style.display = 'flex';
console.log('- CSS Flexbox:', testElement.style.display === 'flex' ? '✅' : '❌');

// 4. Fetch API 테스트
console.log('\n4. Fetch API 테스트:');
if (typeof fetch === 'function') {
  console.log('- Fetch API: ✅');
  // 실제 API 호출 테스트
  fetch('/api/search?q=test')
    .then(response => response.json())
    .then(data => {
      console.log('- API 호출 성공:', Array.isArray(data) ? '✅' : '❌');
    })
    .catch(error => {
      console.log('- API 호출 실패:', '❌', error.message);
    });
} else {
  console.log('- Fetch API: ❌');
}

// 5. 브라우저 정보
console.log('\n5. 브라우저 정보:');
console.log('- User Agent:', navigator.userAgent);
console.log('- 브라우저:', getBrowserInfo());

function getBrowserInfo() {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
}

console.log('\n=== 브라우저 호환성 테스트 완료 ==='); 
---
title: "노션 스타일 코드 블록 테스트"
date: "2025-01-24"
category: "Frontend"
tags: ["Next.js", "MDX", "Styling", "Code"]
status: "published"
isPublished: true
description: "노션과 유사한 스타일의 인라인 코드와 코드 블록을 테스트해보는 글입니다."
---

# 노션 스타일 코드 블록 테스트

이 글은 노션과 유사한 스타일의 인라인 코드와 코드 블록이 제대로 작동하는지 테스트하기 위한 글입니다.

## 인라인 코드 테스트

일반적인 텍스트 중에 `console.log('Hello World')` 같은 인라인 코드가 어떻게 보이는지 확인해보겠습니다.

다른 예시들:
- `npm install react` 명령어
- `const name = "John"` 변수 선언
- `function() {}` 함수 선언
- `true` 또는 `false` 불린 값

## 코드 블록 테스트

### JavaScript 코드 블록

```javascript
// 간단한 JavaScript 예제
function greet(name) {
  console.log(`안녕하세요, ${name}님!`);
  return `Hello, ${name}!`;
}

const user = "철수";
const message = greet(user);
console.log(message);
```

### TypeScript 코드 블록

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getAllUsers(): User[] {
    return [...this.users];
  }
}
```

### React 컴포넌트 예제

```jsx
import React, { useState, useEffect } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
}

const Counter: React.FC<CounterProps> = ({ 
  initialValue = 0, 
  step = 1 
}) => {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(initialValue);

  return (
    <div className="counter">
      <h2>카운터: {count}</h2>
      <div className="buttons">
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
};

export default Counter;
```

### CSS 스타일링 예제

```css
/* 노션 스타일 카운터 컴포넌트 */
.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.counter h2 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  font-weight: 600;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}

.buttons button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.buttons button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}
```

### Python 예제

```python
# Python으로 간단한 계산기 만들기
class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a: float, b: float) -> float:
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result
    
    def subtract(self, a: float, b: float) -> float:
        result = a - b
        self.history.append(f"{a} - {b} = {result}")
        return result
    
    def multiply(self, a: float, b: float) -> float:
        result = a * b
        self.history.append(f"{a} * {b} = {result}")
        return result
    
    def divide(self, a: float, b: float) -> float:
        if b == 0:
            raise ValueError("0으로 나눌 수 없습니다!")
        result = a / b
        self.history.append(f"{a} / {b} = {result}")
        return result
    
    def get_history(self) -> list:
        return self.history.copy()

# 사용 예제
calc = Calculator()
print(calc.add(10, 5))      # 15.0
print(calc.multiply(3, 7))  # 21.0
print(calc.get_history())   # ['10 + 5 = 15.0', '3 * 7 = 21.0']
```

### JSON 데이터 예제

```json
{
  "user": {
    "id": 1,
    "name": "김철수",
    "email": "kim@example.com",
    "profile": {
      "avatar": "https://example.com/avatar.jpg",
      "bio": "프론트엔드 개발자입니다.",
      "skills": ["JavaScript", "React", "TypeScript", "Next.js"]
    },
    "settings": {
      "theme": "dark",
      "notifications": true,
      "language": "ko"
    }
  },
  "posts": [
    {
      "id": 1,
      "title": "React 시작하기",
      "content": "React의 기본 개념을 알아봅니다.",
      "tags": ["React", "JavaScript", "Tutorial"],
      "published": true,
      "created_at": "2025-01-24T10:00:00Z"
    }
  ]
}
```

## 하이라이트 라인 테스트

특정 라인을 하이라이트하는 기능도 테스트해보겠습니다:

```javascript
function processData(data) {
  // 데이터 유효성 검사
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data provided');
  }
  
  // 데이터 변환
  const processed = Object.keys(data).map(key => ({
    id: key,
    value: data[key],
    processed: true
  }));
  
  // 결과 반환
  return processed;
}
```

## 결론

이제 노션과 유사한 스타일의 코드 블록과 인라인 코드가 제대로 작동하는 것을 확인할 수 있습니다. 

주요 특징:
- **인라인 코드**: `monospace` 폰트와 회색 배경, 테두리
- **코드 블록**: 깔끔한 헤더, 언어 표시, 복사 버튼
- **다크모드 지원**: 라이트/다크 테마에 맞는 색상
- **라인 하이라이트**: 특정 라인 강조 기능

이제 블로그에서 코드를 더 깔끔하고 읽기 쉽게 표시할 수 있습니다! 
---
title: "TypeScript 기초: JavaScript의 슈퍼셋"
date: "2025-01-02"
category: "Programming"
tags: ["TypeScript", "JavaScript", "Programming", "Tutorial"]
status: "published"
isPublished: true
description: "TypeScript의 기본 문법과 타입 시스템을 통해 더 안전한 코드를 작성하는 방법을 알아봅니다."
---

# TypeScript 기초: JavaScript의 슈퍼셋

TypeScript는 Microsoft에서 개발한 JavaScript의 상위 집합(Superset) 언어입니다. 정적 타입 검사를 통해 개발 시점에 오류를 발견할 수 있어 더 안전하고 유지보수하기 쉬운 코드를 작성할 수 있습니다.

## TypeScript의 장점

1. **정적 타입 검사**: 컴파일 시점에 타입 오류 발견
2. **향상된 IDE 지원**: 자동완성, 리팩토링 도구
3. **코드 가독성**: 명시적인 타입 선언으로 코드 이해도 향상
4. **대규모 프로젝트 지원**: 복잡한 프로젝트에서 더 안정적인 개발

## 기본 타입

TypeScript는 다양한 기본 타입을 제공합니다:

```typescript
// 기본 타입들
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];

// 열거형
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;

// Any 타입 (타입 검사 비활성화)
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false;

// Void 타입 (함수 반환값이 없을 때)
function warnUser(): void {
  console.log("This is my warning message");
}
```

## 인터페이스

인터페이스를 사용하여 객체의 구조를 정의할 수 있습니다:

```typescript
interface User {
  name: string;
  age: number;
  email?: string; // 선택적 속성
}

function greetUser(user: User): string {
  return `Hello, ${user.name}! You are ${user.age} years old.`;
}

const user: User = {
  name: "John Doe",
  age: 30,
};

console.log(greetUser(user));
```

## 클래스

TypeScript는 클래스 기반 객체 지향 프로그래밍을 지원합니다:

```typescript
class Animal {
  private name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) {
    super(name);
  }
  
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

const sam = new Snake("Sammy the Python");
sam.move();
```

## 제네릭

제네릭을 사용하여 재사용 가능한 컴포넌트를 만들 수 있습니다:

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// 사용 예시
let output1 = identity<string>("myString");
let output2 = identity<number>(100);
let output3 = identity("myString"); // 타입 추론
```

## 실전 예제: API 응답 처리

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return data;
}

// 사용 예시
fetchUser(1).then((response) => {
  console.log(`User: ${response.data.name}`);
});
```

## TypeScript 설정

`tsconfig.json` 파일을 통해 TypeScript 컴파일러 옵션을 설정할 수 있습니다:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

## 다음 단계

TypeScript의 기초를 마스터했다면, 다음 주제들을 학습해보세요:

1. **고급 타입**: Union Types, Intersection Types, Conditional Types
2. **타입 가드**: 타입 좁히기와 타입 가드
3. **데코레이터**: 클래스와 메서드 데코레이터
4. **모듈 시스템**: ES6 모듈과 TypeScript
5. **프레임워크 통합**: React, Vue, Angular와 함께 사용하기

TypeScript는 현대 JavaScript 개발에서 필수적인 도구입니다. 타입 안전성을 통해 더 견고한 애플리케이션을 구축해보세요! 
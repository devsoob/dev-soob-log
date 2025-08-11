---
title: "React 시작하기: 기초부터 실전까지"
date: "2025-01-01"
category: "Frontend"
tags: ["React", "JavaScript", "Frontend", "Tutorial"]
keywords: ["React", "React.js", "JavaScript", "Frontend", "웹 개발", "컴포넌트", "JSX", "Hooks", "상태 관리", "UI 개발"]
status: "published"
isPublished: true
description: "React의 기본 개념부터 실제 프로젝트에 적용하는 방법까지 단계별로 알아봅니다. 컴포넌트, JSX, Hooks, 상태 관리 등 React 핵심 개념을 실습 예제와 함께 학습하세요."
---

# React 시작하기: 기초부터 실전까지

React는 Facebook에서 개발한 JavaScript 라이브러리로, 사용자 인터페이스를 구축하기 위한 컴포넌트 기반 아키텍처를 제공합니다.

## React의 핵심 개념

### 1. 컴포넌트 (Components)
React의 모든 UI는 컴포넌트로 구성됩니다. 컴포넌트는 재사용 가능한 UI 조각입니다.

```jsx
function Welcome(props) {
  return <h1>안녕하세요, {props.name}님!</h1>;
}
```

### 2. JSX
JSX는 JavaScript XML의 줄임말로, React에서 UI를 작성할 때 사용하는 문법입니다.

### 3. Props와 State
- **Props**: 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 방법
- **State**: 컴포넌트 내부에서 관리되는 데이터

## 첫 번째 React 앱 만들기

Create React App을 사용하여 새로운 React 프로젝트를 시작할 수 있습니다:

```bash
npx create-react-app my-app
cd my-app
npm start
```

## 실전 예제

간단한 할 일 목록 앱을 만들어보겠습니다:

```jsx
import React, { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  return (
    <div>
      <h1>할 일 목록</h1>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <button onClick={addTodo}>추가</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 다음 단계

React의 기초를 마스터했다면, 다음 주제들을 학습해보세요:

1. **Hooks**: useState, useEffect, useContext 등
2. **라우팅**: React Router
3. **상태 관리**: Redux, Zustand
4. **타입스크립트**: TypeScript와 React 함께 사용하기

React는 현대 웹 개발에서 필수적인 기술입니다. 꾸준한 학습과 실습을 통해 React 마스터가 되어보세요! 
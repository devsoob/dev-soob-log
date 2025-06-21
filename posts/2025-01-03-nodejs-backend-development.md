---
title: "Node.js 백엔드 개발: Express.js로 REST API 구축하기"
date: "2025-01-03"
category: "Backend"
tags: ["Node.js", "Express.js", "Backend", "API", "JavaScript"]
status: "published"
isPublished: true
description: "Node.js와 Express.js를 사용하여 RESTful API를 구축하는 방법을 단계별로 알아봅니다."
---

# Node.js 백엔드 개발: Express.js로 REST API 구축하기

Node.js는 JavaScript 런타임 환경으로, 서버 사이드 애플리케이션을 개발할 수 있게 해줍니다. Express.js는 Node.js의 가장 인기 있는 웹 프레임워크로, 간단하고 유연한 API 개발을 가능하게 합니다.

## Node.js와 Express.js 소개

### Node.js의 특징
- **비동기 I/O**: 높은 성능과 확장성
- **이벤트 기반**: 논블로킹 이벤트 루프
- **npm 생태계**: 방대한 패키지 라이브러리
- **크로스 플랫폼**: Windows, macOS, Linux 지원

### Express.js의 장점
- **미니멀리즘**: 핵심 기능만 제공하여 유연성 확보
- **미들웨어**: 요청/응답 처리 파이프라인
- **라우팅**: URL 기반 요청 처리
- **템플릿 엔진**: 다양한 뷰 엔진 지원

## 프로젝트 설정

### 1. 프로젝트 초기화

```bash
mkdir my-api
cd my-api
npm init -y
```

### 2. 필요한 패키지 설치

```bash
npm install express cors helmet morgan dotenv
npm install --save-dev nodemon
```

### 3. 기본 서버 설정

```javascript
// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(helmet()); // 보안 헤더 설정
app.use(cors()); // CORS 설정
app.use(morgan('combined')); // 로깅
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my API!' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## RESTful API 설계

### 1. 사용자 관리 API

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// 임시 데이터 (실제로는 데이터베이스 사용)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// GET /api/users - 모든 사용자 조회
router.get('/', (req, res) => {
  res.json(users);
});

// GET /api/users/:id - 특정 사용자 조회
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// POST /api/users - 새 사용자 생성
router.post('/', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /api/users/:id - 사용자 정보 수정
router.put('/:id', (req, res) => {
  const { name, email } = req.body;
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email
  };
  
  res.json(users[userIndex]);
});

// DELETE /api/users/:id - 사용자 삭제
router.delete('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

module.exports = router;
```

### 2. 라우터 연결

```javascript
// app.js에 추가
const usersRouter = require('./routes/users');

app.use('/api/users', usersRouter);
```

## 미들웨어 활용

### 1. 인증 미들웨어

```javascript
// middleware/auth.js
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  // JWT 토큰 검증 로직 (실제로는 jsonwebtoken 라이브러리 사용)
  try {
    // 토큰 검증 로직
    req.user = { id: 1, name: 'John Doe' }; // 예시
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateToken };
```

### 2. 에러 처리 미들웨어

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

## 데이터베이스 연동

### MongoDB와 Mongoose 사용

```bash
npm install mongoose
```

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 환경 변수 설정

```bash
# .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/my-api
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## 테스트

### API 테스트 예제

```bash
# 사용자 목록 조회
curl http://localhost:3000/api/users

# 새 사용자 생성
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'

# 특정 사용자 조회
curl http://localhost:3000/api/users/1
```

## 배포 고려사항

1. **환경 변수**: 민감한 정보는 환경 변수로 관리
2. **로깅**: Winston, Bunyan 등의 로깅 라이브러리 사용
3. **모니터링**: PM2, New Relic 등으로 애플리케이션 모니터링
4. **보안**: Helmet, Rate Limiting, Input Validation
5. **성능**: 캐싱, 압축, CDN 활용

## 다음 단계

Node.js 백엔드 개발의 기초를 마스터했다면, 다음 주제들을 학습해보세요:

1. **데이터베이스**: MongoDB, PostgreSQL, Redis
2. **인증**: JWT, OAuth, Passport.js
3. **테스트**: Jest, Supertest
4. **GraphQL**: Apollo Server
5. **마이크로서비스**: Docker, Kubernetes

Node.js와 Express.js는 현대 웹 개발에서 강력한 백엔드 솔루션을 제공합니다. 실습을 통해 더 깊이 있는 학습을 진행해보세요! 
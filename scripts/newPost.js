const fs = require("fs");
const path = require("path");

const postsDir = path.join(__dirname, "../posts");

// 날짜와 제목 받아서 파일명 만들기 (예: 2025-05-24-my-post.md)
const date = new Date().toISOString().slice(0, 10);
const title = process.argv[2] || "untitled-post"; // 커맨드라인에서 제목 인자로 받거나 기본값
const fileName = `${date}-${title.replace(/\s+/g, "-").toLowerCase()}.md`;
const filePath = path.join(postsDir, fileName);

// Frontmatter 템플릿 작성
const template = `---
title: "${title.replace(/-/g, " ")}"
date: "${date}"
tags: []
---

# ${title.replace(/-/g, " ")}

여기에 내용을 작성하세요.
`;

// posts 폴더가 없으면 만들기
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir);
}

// 새 파일 생성
fs.writeFileSync(filePath, template);

console.log(`새 글이 생성되었습니다: ${filePath}`);

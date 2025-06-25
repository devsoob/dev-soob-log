import { Feed } from 'feed';
import fs from 'fs';
import { getAllPostsSync } from '../lib/posts';

async function generateRssFeed() {
  const posts = getAllPostsSync();
  const siteURL = 'https://dev-log-pi.vercel.app';
  const date = new Date();

  const feed = new Feed({
    title: 'Dev Log',
    description: '개발 경험과 지식을 공유하는 개발 블로그',
    id: siteURL,
    link: siteURL,
    language: 'ko',
    image: `${siteURL}/images/og-image.png`,
    favicon: `${siteURL}/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}`,
    updated: date,
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: `${siteURL}/rss.xml`,
    },
  });

  posts.forEach((post) => {
    if (!post.title || !post.date || !post.slug || !post.author) return;
    
    const url = `${siteURL}/posts/${post.slug}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.excerpt,
      content: post.excerpt,
      author: [
        {
          name: post.author.name || 'Anonymous',
          link: post.author.picture || '/images/default-avatar.png',
        },
      ],
      date: new Date(post.date),
    });
  });

  fs.writeFileSync('./public/rss.xml', feed.rss2());
}

generateRssFeed(); 
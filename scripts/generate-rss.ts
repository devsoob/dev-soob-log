import { Feed } from 'feed';
import fs from 'fs';
import { getAllPosts } from '../lib/api';

async function generateRssFeed() {
  const posts = getAllPosts(['title', 'date', 'slug', 'author', 'coverImage', 'excerpt']);
  const siteURL = 'https://dev-log.vercel.app';
  const date = new Date();

  const feed = new Feed({
    title: 'Dev Log',
    description: 'A blog about development and technology',
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
    const url = `${siteURL}/posts/${post.slug}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.excerpt,
      content: post.excerpt,
      author: [
        {
          name: post.author.name,
          link: post.author.picture,
        },
      ],
      date: new Date(post.date),
    });
  });

  fs.writeFileSync('./public/rss.xml', feed.rss2());
}

generateRssFeed(); 
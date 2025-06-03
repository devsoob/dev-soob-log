import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

interface TagPageProps {
  posts: Post[];
  tag: string;
}

export default function TagPage({ posts, tag }: TagPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <NextSeo
        title={`${tag} 관련 포스트 | Dev Log`}
        description={`${tag} 태그가 포함된 모든 블로그 포스트`}
      />

      <h1 className="text-3xl font-bold mb-8">
        태그: <span className="text-blue-600">#{tag}</span>
      </h1>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b pb-8">
            <Link
              href={`/posts/${post.slug}`}
              className="block hover:text-blue-600 transition-colors"
            >
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center text-sm text-gray-500">
                <time>{new Date(post.date).toLocaleDateString()}</time>
                <span className="mx-2">·</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 px-2 py-1 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-gray-600">
          이 태그가 포함된 포스트가 없습니다.
        </p>
      )}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const allTags = new Set<string>();

  filenames.forEach((filename) => {
    if (filename.endsWith('.mdx') || filename.endsWith('.md')) {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach((tag: string) => allTags.add(tag));
      }
    }
  });

  const paths = Array.from(allTags).map((tag) => ({
    params: { tag },
  }));

  console.log('Generated tag paths:', paths);

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tag = params?.tag as string;
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter((filename) => filename.endsWith('.mdx') || filename.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug: filename.replace(/\.(mdx?|md)$/, ''),
        title: data.title || '',
        date: data.date || '',
        excerpt: content.slice(0, 200).trim() + '...',
        tags: data.tags || [],
      };
    })
    .filter((post) => post.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log(`Found ${posts.length} posts for tag: ${tag}`);

  return {
    props: {
      posts,
      tag,
    },
  };
}; 
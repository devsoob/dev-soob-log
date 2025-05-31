import { GetStaticProps } from "next";
import { getDatabaseItems } from "@/lib/notion";

type Post = {
  id: string;
  properties: any;
};

interface Props {
  posts: Post[];
}

export default function Home({ posts }: Props) {
  return (
    <div>
      <h1>Notion Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.properties?.Title?.type === "title" &&
            post.properties?.Title?.title?.length > 0
              ? post.properties.Title.title[0].plain_text
              : "No title"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getDatabaseItems(process.env.NOTION_DATABASE_ID!);
  return { props: { posts } };
};

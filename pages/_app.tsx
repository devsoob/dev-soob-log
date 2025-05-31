import React from "react";
import { MDXProvider } from "@mdx-js/react";
import type { AppProps } from "next/app";

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 style={{ color: "tomato" }} {...props} />
  ),
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={components}>
      <Component {...pageProps} />
    </MDXProvider>
  );
}

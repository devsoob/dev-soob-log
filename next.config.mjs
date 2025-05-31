// next.config.mjs
import pkg from "@mdx-js/loader";
const { createLoader } = pkg;

const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  experimental: {
    appDir: true,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
          options: {
            providerImportSource: "@mdx-js/react",
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;

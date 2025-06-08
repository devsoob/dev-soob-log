/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dev-log-pi.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  transform: async (config, path) => {
    // 경로를 URL 인코딩
    const encodedPath = encodeURI(path);
    return {
      loc: encodedPath,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
} 
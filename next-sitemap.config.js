/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  transform: async (config, path) => {
    // 포스트 페이지는 더 높은 우선순위와 더 자주 업데이트
    if (path.startsWith('/posts/')) {
      return {
        loc: `${config.siteUrl}${path}`,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString()
      }
    }
    // 메인 페이지는 높은 우선순위
    if (path === '/') {
      return {
        loc: `${config.siteUrl}${path}`,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString()
      }
    }
    // 검색 페이지는 낮은 우선순위
    if (path === '/search') {
      return {
        loc: `${config.siteUrl}${path}`,
        changefreq: 'monthly',
        priority: 0.3,
        lastmod: new Date().toISOString()
      }
    }
    return {
      loc: `${config.siteUrl}${path}`,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString()
    }
  },
  additionalPaths: async (config) => {
    const result = [];
    return result;
  },
  exclude: ['**/tags/**', '/api/**', '/_next/**', '/404', '/500']
} 
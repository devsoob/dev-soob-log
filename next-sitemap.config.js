/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dev-log-pi.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://dev-log-pi.vercel.app/server-sitemap.xml',
    ],
  },
} 
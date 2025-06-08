/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dev-log-pi.vercel.app',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  transform: async (config, path) => {
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
  exclude: ['**/tags/**']
} 
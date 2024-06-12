/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL,
  generateIndexSitemap: false,
  generateRobotsTxt: true,
};

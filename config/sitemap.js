import sitemapjson from '../assets/json/sitemap'
const sitemap = {
  path: '/sitemap.xml',
  hostname: 'https://www.starday.jp/',
  cacheTime: 1000 * 60 * 60 * 24,
  exclude: [
    '**'
  ],
  gzip: true,
  generate: false,
  routes: () => {
    return sitemapjson
  }
}
export default sitemap

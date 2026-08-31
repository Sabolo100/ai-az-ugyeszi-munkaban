export const dynamic = 'force-static';
export default function robots() {
  return process.env.SITE_PUBLIC === '1'
    ? {
        rules: { userAgent: '*', allow: '/' },
        sitemap: `${process.env.SITE_ORIGIN}/sitemap.xml`,
      }
    : { rules: { userAgent: '*', disallow: '/' } };
}

import type { Metadata } from 'next';
import { Header, Footer } from '@/components/site';
import '@fontsource-variable/inter';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: 'AI az ügyészi munkában — Az iratoktól az összefüggésekig',
    template: '%s | AI az ügyészi munkában',
  },
  description:
    'Hogyan gyorsíthatók a korrupciós eljárások AI segítségével? Fiktív ügyek, másolható promptok, saját alkalmazások és ellenőrizhető szakmai módszerek.',
  openGraph: {
    title: 'AI az ügyészi munkában',
    description:
      'Az iratoktól az összefüggésekig. Feladatok, módszerek és kipróbálható minták.',
    locale: 'hu_HU',
    type: 'website',
    images: [
      {
        url: `${process.env.SITE_ORIGIN || 'http://localhost:3000'}/og.png`,
        width: 1731,
        height: 909,
        alt: 'AI az ügyészi munkában — Az iratoktól az összefüggésekig.',
      },
    ],
  },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon.svg` },
  alternates: { canonical: process.env.SITE_ORIGIN || 'http://localhost:3000' },
  twitter: {
    card: 'summary_large_image',
    title: 'AI az ügyészi munkában',
    description: 'Az iratoktól az összefüggésekig.',
    images: [`${process.env.SITE_ORIGIN || 'http://localhost:3000'}/og.png`],
  },
  robots: { index: process.env.SITE_PUBLIC === '1', follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body>
        <a className="skip-link" href="#main">
          Ugrás a tartalomhoz
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

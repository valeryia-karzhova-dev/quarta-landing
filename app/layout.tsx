import type { Metadata, Viewport } from 'next';
import { Bitter, Onest } from 'next/font/google';
import './globals.css';

const head = Bitter({ subsets: ['cyrillic', 'latin'], weight: ['700', '800'], variable: '--f-head', display: 'swap' });
const body = Onest({ subsets: ['cyrillic', 'latin'], weight: ['400', '600'], variable: '--f-body', display: 'swap' });

const title = 'Кварта: свежеобжаренный кофе в Минске';
const description = 'Жарим в четверг, в пятницу привозим. Зерно у вас на 1–3 день после обжарки. Подписка 54 BYN в месяц.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title,
  description,
  openGraph: { title, description, locale: 'ru_BY', type: 'website', images: [{ url: '/hero.jpg', width: 880, height: 880 }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/hero.jpg'] },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${head.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}

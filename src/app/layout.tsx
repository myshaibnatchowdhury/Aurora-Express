import type { Metadata } from 'next';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-bengali',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'অরোরা এক্সপ্রেস | AURORA EXPRESS - Bus Ticket Booking & Counter SaaS',
  description:
    'অরোরা এক্সপ্রেস - দেশের পথে, আপনার সাথে। আধুনিক অনলাইন বাস টিকিট বুকিং, রিয়েল-টাইম সিট সিলেকশন ও কাউন্টার ম্যানেজমেন্ট সিস্টেম।',
  icons: {
    icon: '/images/aurora-logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${inter.variable} ${notoSansBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

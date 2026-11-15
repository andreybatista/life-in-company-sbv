import {getSeoSettings} from '@/sanity/seo';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({variable: '--font-inter', subsets: ['latin'], display: 'swap'});

export async function generateMetadata() {
  const settings = await getSeoSettings();
  return {
    title: settings?.siteName || 'Life in Company SBV',
    icons: {icon: settings?.favicon || '/favicon.ico'},
  };
}
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}


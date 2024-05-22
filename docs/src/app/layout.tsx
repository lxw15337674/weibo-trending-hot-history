import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from '@/components/SiteHeader';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {

  return {
    title: `微博热搜榜`,
    description: `微博热搜榜`,
    icons: {
      'icon': 'https://img.icons8.com/stickers/100/000000/weibo.png',
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

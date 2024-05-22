import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from '@/components/SiteHeader';

const inter = Inter({ subsets: ['latin'] });
type Props = {
  params: { date: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const date = params.date;

  return {
    title: `微博热搜榜`,
    description: `微博热搜榜`,
    icons: {
      'icon': 'https://s.weibo.com/favicon.ico',
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

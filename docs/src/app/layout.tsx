import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from '@/components/SiteHeader';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://weibo-trending-hot-history.vercel.app';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: '',
      template: '%s'
    },
    description: '提供每日微博热搜榜单的历史记录查询，追踪热点事件和话题趋势。支持按日期查看历史热搜数据，了解社会热点变化。',
    keywords: ['微博热搜', '热搜历史', '微博榜单', '热点事件', '社会热点', '微博数据', '热搜归档', '每日热搜'],
    authors: [{ name: 'weibo-trending-hot-history' }],
    creator: 'weibo-trending-hot-history',
    publisher: 'weibo-trending-hot-history',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: 'https://img.icons8.com/stickers/32/000000/weibo.png', sizes: '32x32' },
        { url: 'https://img.icons8.com/stickers/64/000000/weibo.png', sizes: '64x64' },
        { url: 'https://img.icons8.com/stickers/100/000000/weibo.png', sizes: '100x100' }
      ],
      apple: 'https://img.icons8.com/stickers/180/000000/weibo.png',
    },
    manifest: '/manifest.json',
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url: baseUrl,
      title: '微博热搜历史归档 - 每日热搜榜单记录查询',
      description: '提供每日微博热搜榜单的历史记录查询，追踪热点事件和话题趋势。',
      siteName: '微博热搜历史归档',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: '微博热搜历史归档',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: '微博热搜历史归档 - 每日热搜榜单记录查询',
      description: '提供每日微博热搜榜单的历史记录查询，追踪热点事件和话题趋势。',
      images: [`${baseUrl}/og-image.png`],
      creator: '@weibo_trending',
    },
    alternates: {
      canonical: baseUrl,
    },
    category: 'technology',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL || 'https://weibo-trending-hot-history.vercel.app'} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />

        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "微博热搜历史归档",
              "description": "提供每日微博热搜榜单的历史记录查询，追踪热点事件和话题趋势。",
              "url": process.env.NEXT_PUBLIC_BASE_URL || 'https://weibo-trending-hot-history.vercel.app',
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://weibo-trending-hot-history.vercel.app'}/hots/{search_term_string}`
                },
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "微博热搜历史归档"
              }
            })
          }}
        />
      </head>
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
        <Analytics />
      </body>
    </html>
  );
}

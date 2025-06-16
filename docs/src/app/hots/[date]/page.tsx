import type { Metadata } from 'next';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DatePicker } from '@/components/DayPicker';
import { numberWithUnit } from '@/lib/utils';

interface HotsProps {
  params: { date: string };
  searchParams: { sort: string };
}

interface SavedWeibo {
  title: string;
  category: string;
  description: string;
  url: string;
  hot: number;
  ads: boolean;
  readCount?: number;
  discussCount?: number;
  origin?: number;
}

async function getData(date: string): Promise<SavedWeibo[]> {
  const res = await fetch(
    // `https://cdn.jsdelivr.net/gh/lxw15337674/weibo-trending-hot-history@master/api/${date}/summary.json`,
    `https://raw.githubusercontent.com/lxw15337674/weibo-trending-hot-history/master/api/${date}/summary.json`,
    {
      next: { revalidate: 60 }
    })
  if (!res.ok) {
    return [];
  }
  return res.json()
}

export async function generateMetadata(
  { params }: HotsProps,
): Promise<Metadata> {
  const date = params.date;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://weibo-trending-hot-history.vercel.app';
  const pageUrl = `${baseUrl}/hots/${date}`;

  // 尝试获取当天数据来生成更准确的描述
  let topTopics = '';
  try {
    const data = await getData(date);
    const top3 = data.slice(0, 3).map(item => item.title).join('、');
    if (top3) {
      topTopics = `，当日热门话题包括：${top3}等`;
    }
  } catch (error) {
    // 忽略错误，使用默认描述
  }

  const formattedDate = dayjs(date).format('YYYY年MM月DD日');
  const title = `${date} 微博热搜榜 `;
  const description = `查看${formattedDate}的微博热搜榜单，了解当日热点事件和社会话题${topTopics}。`;

  return {
    title,
    description,
    keywords: [`微博热搜 ${date}`, `${formattedDate}热搜`, '微博榜单', '热点事件', '社会热点', `${date}新闻`],
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'article',
      publishedTime: dayjs(date).toISOString(),
      modifiedTime: new Date().toISOString(),
      section: '微博热搜',
      authors: ['微博热搜历史归档'],
      images: [
        {
          url: `${baseUrl}/og-image-${date}.png`,
          width: 1200,
          height: 630,
          alt: `${formattedDate}微博热搜榜单`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image-${date}.png`],
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      'article:published_time': dayjs(date).toISOString(),
      'article:modified_time': new Date().toISOString(),
      'article:section': '微博热搜',
    },
  };
}

export default async function Hots({ params: { date }, searchParams: { sort = 'hot' } }: HotsProps) {
  const data = await getData(date || dayjs().format('YYYY-MM-DD'));
  const formattedDate = dayjs(date).format('YYYY年MM月DD日');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://weibo-trending-hot-history.vercel.app';

  // 生成结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${formattedDate}微博热搜榜单`,
    "description": `${formattedDate}的微博热搜排行榜，包含当日最热门的话题和事件`,
    "url": `${baseUrl}/hots/${date}`,
    "datePublished": dayjs(date).toISOString(),
    "dateModified": new Date().toISOString(),
    "itemListElement": data.slice(0, 10).map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "name": item.title,
        "description": item.description || "微博热搜话题",
        "url": `https://s.weibo.com/weibo?q=%23${item.title}%23`,
        "datePublished": dayjs(date).toISOString(),
        "author": {
          "@type": "Organization",
          "name": "微博"
        },
        "publisher": {
          "@type": "Organization",
          "name": "微博热搜历史归档"
        },
        "interactionStatistic": [
          {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/ViewAction",
            "userInteractionCount": item.hot || 0
          }
        ]
      }
    })),
    "publisher": {
      "@type": "Organization",
      "name": "微博热搜历史归档"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <main className="p-5 lg:p-0 lg:pt-5">
        <div className="mx-auto max-w-[980px]">
          <h1 className="sr-only">{formattedDate}微博热搜榜单</h1>
          <Menubar className="flex justify-between">
            <MenubarMenu>
              <Link
                href={`/hots/${dayjs(date)
                  .subtract(1, 'day')
                  .format('YYYY-MM-DD')}?sort=${sort}`}
              >
                <MenubarTrigger
                  className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >前一天</MenubarTrigger>
              </Link>
            </MenubarMenu>
            <MenubarMenu>
              <DatePicker value={date} sort={sort} />
            </MenubarMenu>
            <MenubarMenu >
              <Link
                href={`/hots/${dayjs(date).add(1, 'day').format('YYYY-MM-DD')}?sort=${sort}`}
              >
                <MenubarTrigger
                  className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={dayjs(date).isAfter(dayjs().subtract(1, 'day'))}
                >
                  后一天
                </MenubarTrigger>
              </Link>
            </MenubarMenu>
          </Menubar>
        </div>

        <div className="mx-auto flex max-w-[980px] flex-col gap-2 py-4">
          {data.sort((a, b) => (Number(b[sort as keyof SavedWeibo]) ?? 0) - (Number(a[sort as keyof SavedWeibo]) ?? 0)).map((item: SavedWeibo, index) => {
            const url = `https://s.weibo.com/weibo?q=%23${item.title}%23`;
            return (
              <a
                href={url}
                key={item.title}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`查看微博话题：${item.title}`}
              >
                <Card className="cursor-pointer hover:bg-muted/50">
                  <CardHeader>
                    <CardTitle>
                      <div className="flex gap-2">
                        <h2 className="text-xl">
                          <span className="sr-only">第{index + 1}名：</span>
                          {item.title}
                        </h2>
                        <div className="flex gap-2 items-center flex-shrink-0 flex-wrap max-w-[60%]">
                          {item.category && <Badge>{item.category.trim()}</Badge>}
                          {item.ads && <Badge variant="destructive">推广</Badge>}
                          <Badge variant="outline">🔥 {numberWithUnit(item?.hot ?? 0)}</Badge>
                          {item.readCount && <Badge variant="outline">阅读 {numberWithUnit(item.readCount)}</Badge>}
                          {item.discussCount && <Badge variant="outline">讨论 {numberWithUnit(item.discussCount)}</Badge>}
                          {item.origin && <Badge variant="outline">原创 {numberWithUnit(item.origin)}</Badge>}
                        </div>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {item.description || "没有描述"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </a>
            );
          })}
        </div>
      </main>
    </>
  );
}

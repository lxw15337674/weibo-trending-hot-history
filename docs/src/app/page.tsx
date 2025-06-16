import dayjs from 'dayjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

async function getLatestHots(): Promise<SavedWeibo[]> {
  const today = dayjs().format('YYYY-MM-DD');
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/lxw15337674/weibo-trending-hot-history/master/api/${today}/summary.json`,
      { next: { revalidate: 300 } } // 5分钟缓存
    );
    if (!res.ok) {
      // 如果今天没有数据，尝试昨天
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      const res2 = await fetch(
        `https://raw.githubusercontent.com/lxw15337674/weibo-trending-hot-history/master/api/${yesterday}/summary.json`,
        { next: { revalidate: 300 } }
      );
      return res2.ok ? res2.json() : [];
    }
    return res.json();
  } catch {
    return [];
  }
}

export default async function Page() {
  const latestHots = await getLatestHots();
  const todayDate = dayjs().format('YYYY-MM-DD');
  const todayFormatted = dayjs().format('YYYY年MM月DD日');

  // 结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "微博热搜历史归档",
    "description": "提供每日微博热搜榜单的历史记录查询，追踪热点事件和话题趋势。",
    "url": process.env.NEXT_PUBLIC_BASE_URL || 'https://weibo-trending-hot-history.vercel.app',
    "mainEntity": {
      "@type": "ItemList",
      "name": `${todayFormatted}微博热搜`,
      "numberOfItems": latestHots.length,
      "itemListElement": latestHots.slice(0, 5).map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "name": item.title,
          "description": item.description || "微博热搜话题"
        }
      }))
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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">微博热搜历史归档</h1>
          <p className="text-xl text-muted-foreground mb-6">
            追踪每日热搜榜单，记录社会热点变化
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            从2024年5月20日开始，我们持续记录微博热搜榜单的历史数据，帮助您了解热点事件的发展趋势。
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <Link href={`/hots/${todayDate}?sort=hot`}>
              <Button size="lg">查看今日热搜</Button>
            </Link>
            <Link href={`/hots/${dayjs().subtract(1, 'day').format('YYYY-MM-DD')}?sort=hot`}>
              <Button variant="outline" size="lg">查看昨日热搜</Button>
            </Link>
          </div>
        </div>

        {latestHots.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>今日热搜预览</CardTitle>
              <CardDescription>
                {todayFormatted}最新热搜话题
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {latestHots.slice(0, 5).map((item, index) => (
                  <div key={item.title} className="flex items-center gap-3 p-3 rounded-lg border">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      🔥 {item.hot?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href={`/hots/${todayDate}?sort=hot`}>
                  <Button variant="outline">查看完整榜单</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>功能特色</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold">📅 历史查询</h3>
                <p className="text-sm text-muted-foreground">支持查询任意日期的热搜榜单</p>
              </div>
              <div>
                <h3 className="font-semibold">🔍 多维排序</h3>
                <p className="text-sm text-muted-foreground">支持按热度、阅读量、讨论量排序</p>
              </div>
              <div>
                <h3 className="font-semibold">📊 数据完整</h3>
                <p className="text-sm text-muted-foreground">包含话题分类、描述、统计数据等</p>
              </div>
              <div>
                <h3 className="font-semibold">🔗 直达链接</h3>
                <p className="text-sm text-muted-foreground">点击即可跳转到微博查看详情</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>数据说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold">📈 数据来源</h3>
                <p className="text-sm text-muted-foreground">数据来源于微博官方热搜榜单</p>
              </div>
              <div>
                <h3 className="font-semibold">⏰ 更新频率</h3>
                <p className="text-sm text-muted-foreground">每日定时采集和更新</p>
              </div>
              <div>
                <h3 className="font-semibold">🗂️ 存档时间</h3>
                <p className="text-sm text-muted-foreground">从2024年5月20日开始归档</p>
              </div>
              <div>
                <h3 className="font-semibold">📱 响应式设计</h3>
                <p className="text-sm text-muted-foreground">支持手机、平板、电脑访问</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            本项目为开源项目，仅供学习和研究使用。数据版权归微博所有。
          </p>
        </div>
      </main>
    </>
  );
}
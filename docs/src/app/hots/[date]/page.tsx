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
import { Suspense } from 'react';
interface HotsProps {
  params: { date: string };
  searchParams: { sort: string };
}

export async function generateMetadata(
  { params }: HotsProps,
): Promise<Metadata> {
  const date = params.date;
  return {
    title: `微博热搜榜  ${date}`,
    description: `微博热搜榜  ${date}`,
  };
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
      next: { revalidate: 3600 }
    }
  );

  if (!res.ok) {
    return [];
  }
  return res.json()
}

export default async function Hots({ params: { date }, searchParams: { sort = 'hot' } }: HotsProps) {
  const data = await getData(date || dayjs().format('YYYY-MM-DD'));
  return (
    <main className="p-5 lg:p-0 lg:pt-5">
      <div className="mx-auto max-w-[980px]">
        <Menubar className="flex justify-between">
          <MenubarMenu>
            <Link
              href={`/hots/${dayjs(date)
                .subtract(1, 'day')
                .format('YYYY-MM-DD')}`}
            >
              <MenubarTrigger
                className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >前一天</MenubarTrigger>
            </Link>
          </MenubarMenu>
          <MenubarMenu>
            <DatePicker value={date} />
          </MenubarMenu>
          <MenubarMenu >
            <Link
              href={`/hots/${dayjs(date).add(1, 'day').format('YYYY-MM-DD')}`}
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
        {data.sort((a, b) => (Number(b[sort as keyof SavedWeibo]) ?? 0) - (Number(a[sort as keyof SavedWeibo]) ?? 0)).map((item: SavedWeibo) => {
          const url = `https://s.weibo.com/weibo?q=%23${item.title}%23`;
          return (
            <a
              href={url}
              key={item.title}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="cursor-pointer hover:bg-muted/50">
                <CardHeader>
                  <CardTitle>
                    <div className="flex gap-2">
                      <h5 className="text-xl ">
                        {item.title}
                      </h5>
                      <div className="flex gap-2 items-center flex-shrink-0 flex-wrap max-w-[60%]">
                        {item.category && <Badge>{item.category.trim()}</Badge>}
                        {item.ads && <Badge variant="destructive">推广</Badge>}
                        <Badge variant="outline">🔥 {item?.hot ?? 0}</Badge>
                        {item.readCount && <Badge variant="outline">阅读 {item.readCount}</Badge>}
                        {item.discussCount && <Badge variant="outline">讨论 {item.discussCount}</Badge>}
                        {item.origin && <Badge variant="outline">原创 {item.origin}</Badge>}
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
  );
}

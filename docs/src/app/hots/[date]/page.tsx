import type { Metadata, ResolvingMetadata } from 'next';
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
interface HotsProps {
  params: { date: string };
}
interface Weibo {
  title: string;
  category: string;
  description: string;
  url: string;
  hot: number;
  ads: boolean;
}

async function getData(date: string): Promise<Weibo[]> {
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

export default async function Hots({ params: { date } }: HotsProps) {
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
        {data.map((item) => {
          const url = `https://s.weibo.com/weibo?q=%23${item.title}%23`;
          return (
            <a
              href={url}
              key={url}
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
                      <div className="flex gap-2 items-center flex-shrink-0">
                        {item.category && <Badge>{item.category.trim()}</Badge>}
                        {item.ads && <Badge variant="destructive">推广</Badge>}
                        {<Badge variant="outline">🔥 {item?.hot ?? 0}</Badge>}
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

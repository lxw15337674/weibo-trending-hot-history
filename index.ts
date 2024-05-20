import util from 'util';
import dayjs from 'dayjs';
import * as cheerio from 'cheerio';
import _ from 'lodash';
import { createArchive, createList, ensureDir, readFile, writeFile } from './utils';
import { SavedWeibo } from './type';

const TRENDING_URL =
  'https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26t%3D3%26disable_hot%3D1%26filter_type%3Drealtimehot';
const TRENDING_DETAIL_URL = 'https://m.s.weibo.com/topic/detail?q=%s';
const readmePath = './README.md';

function extractNumbers(str?: string | number): number {
  if (!str) return 0;
  str = str.toString();
  return parseInt(str?.replace(/[^0-9]/g, ''), 10) || 0;
}
let RETRY_TIME = 5;

interface WeiboItem {
  desc: string;
  desc_extr: string;
  scheme: string;
  category: string;
  description: string;
  promotion: any;
}

async function saveHourlyJson(words: SavedWeibo[]) {
  const date = dayjs().format('YYYY-MM-DD');
  const hour = dayjs().format('HH');
  const dirPath = `./api/${date}`;
  const fullPath = `${dirPath}/${hour}.json`;
  await ensureDir(dirPath);
  const allHots = _.sortBy(_.uniqBy(words, 'title'), 'hot').reverse();
  writeFile(fullPath, JSON.stringify(allHots, null, 2));
}

async function saveDayJson(words: SavedWeibo[]) {
  const date = dayjs().format('YYYY-MM-DD');
  const fullPath = `./api/${date}/summary.json`;
  await ensureDir(`./api/${date}`);
  let wordsAlreadyDownload: SavedWeibo[] = [];
  const content = await readFile(fullPath)
  if (content) {
    wordsAlreadyDownload = JSON.parse(content.toString()) as SavedWeibo[];
  }
  for (let word of words) {
    const index = wordsAlreadyDownload.findIndex(o => o.title === word.title)
    if (index !== -1) {
      const oldWord = wordsAlreadyDownload[index]
      oldWord.hot = word.hot > oldWord.hot ? word.hot : oldWord.hot
    } else {
      wordsAlreadyDownload.push(word)
    }
  }
  wordsAlreadyDownload.sort((a, b) => b.hot - a.hot)
  await writeFile(fullPath, JSON.stringify(wordsAlreadyDownload, null, 2));
  const data = await createArchive(wordsAlreadyDownload, date)
  await writeFile(`./archives/${date}.md`, data);
  await createReadme(wordsAlreadyDownload)
}

async function fetchTrendingDetail(title: string): Promise<{ category?: string; desc?: string }> {
  try {
    const res = await fetch(util.format(TRENDING_DETAIL_URL, title));
    const data = await res.text();
    const $ = cheerio.load(data);
    return {
      category: $('#pl_topicband dl>dd').first().text(),
      desc: $('#pl_topicband dl:eq(1)').find('dd:not(.host-row)').last().text(),
    };
  } catch {
    return {};
  }
}

export async function createReadme(words: SavedWeibo[]) {
  let content = await readFile(readmePath) as string
  content = content.replace(/<!-- BEGIN -->[\W\w]*<!-- END -->/, createList(words));
  await writeFile(readmePath, content);
}

async function bootstrap() {
  while (RETRY_TIME > 0) {
    try {
      const res = await fetch(TRENDING_URL);
      const data = await res.json() as { ok: number; data: { cards: { card_group: WeiboItem[] }[] } };
      if (data.ok === 1) {
        const items = data.data.cards[0]?.card_group;
        if (items) {
          for (let item of items) {
            const { category, desc } = await fetchTrendingDetail(
              encodeURIComponent(item.desc),
            );
            item.category = category || item.category;
            item.description = desc || item.description;
          }
          const words = items.map((o) => ({
            title: o.desc,
            category: o.category,
            description: o.description,
            url: o.scheme,
            hot: extractNumbers(o.desc_extr),
            ads: !!o.promotion,
          }));
          await Promise.all([saveHourlyJson(words), saveDayJson(words)]);
        }
      }
      RETRY_TIME = 0;
    } catch (err) {
      console.log(err);
      RETRY_TIME -= 1;
    }
  }
  process.exit(0);
}

bootstrap();
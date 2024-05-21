import util from 'util';
import dayjs from 'dayjs';
import * as cheerio from 'cheerio';
import _ from 'lodash';
import { convertToNumber, createArchive, createList, ensureDir, readFile, writeFile } from './utils';
import { Detail, SavedWeibo, WeiboItem } from './type';

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
      oldWord.hot = Math.max(word.hot, oldWord.hot)
      oldWord.origin = Math.max(word?.origin ?? 0, oldWord?.origin ?? 0)
      oldWord.readCount = Math.max(word?.readCount ?? 0, oldWord?.readCount ?? 0)
      oldWord.discussCount = Math.max(word?.discussCount ?? 0, oldWord?.discussCount ?? 0)
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

async function fetchTrendingDetail(title: string): Promise<Detail> {
  try {
    const res = await fetch(util.format(TRENDING_DETAIL_URL, title));
    const data = await res.text();
    const $ = cheerio.load(data);
    const count: number[] = [];

    $('div.g-list-a.data ul li').each(function () {
      const strongText = $(this).find('strong').text();
      const unitText = $(this).text().replace(strongText, '').trim();
      const strongNumber = Number(strongText.replace(/,/g, ''));
      count.push(convertToNumber(strongNumber, unitText));
    });
    return {
      category: $('#pl_topicband dl>dd').first().text().trim(),
      desc: $('#pl_topicband dl:eq(1)').find('dd:not(.host-row)').last().text(),
      readCount: count[0],
      discussCount: count[1],
      origin: count[2],
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
          const words = await Promise.all(
            items.map(async (item) => {
              const detail = await fetchTrendingDetail(encodeURIComponent(item.desc));
              return {
                title: item.desc,
                category: detail.category || item.category,
                description: detail.desc || item.description,
                url: item.scheme,
                hot: extractNumbers(item.desc_extr),
                ads: !!item.promotion,
                readCount: detail.readCount,
                discussCount: detail.discussCount,
                origin: detail.origin,
              };
            })
          );
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
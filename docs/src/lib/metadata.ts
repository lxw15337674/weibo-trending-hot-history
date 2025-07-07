interface SavedWeibo {
  title: string;
  category: string;
  description?: string;
  url: string;
  hot: number;
  ads: boolean;
  readCount?: number;
  discussCount?: number;
  origin?: number;
}

interface MetadataResult {
  title: string;
  description: string;
  keywords: string[];
}

/**
 * 清理热搜话题标题，移除特殊符号
 */
function cleanTopicTitle(title: string): string {
  return title
    .replace(/[#\[\]]/g, '') // 移除 # 和 []
    .replace(/[""'']/g, '') // 移除引号
    .trim();
}

/**
 * 基于热搜数据生成动态metadata
 */
export function generateHotSearchMetadata(
  date: string,
  hotSearchData: SavedWeibo[]
): MetadataResult {
  const formattedDate = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));

  // 过滤掉广告，获取真实热搜
  const realHotSearches = hotSearchData.filter(item => !item.ads);
  
  // 获取前3个话题用于title
  const topTopics = realHotSearches
    .slice(0, 3)
    .map(item => cleanTopicTitle(item.title))
    .join('、');

  // 获取前10个话题用于description
  const top10Topics = realHotSearches
    .slice(0, 10)
    .map(item => cleanTopicTitle(item.title))
    .join('、');

  // 生成title
  const title = topTopics 
    ? `${date} 微博热搜 - ${topTopics}等热门话题`
    : `${date} 微博热搜榜单`;

  // 生成description
  const description = top10Topics
    ? `${formattedDate}微博热搜榜单：${top10Topics}等${realHotSearches.length}条热门话题。查看完整排行榜和详细数据。`
    : `${formattedDate}微博热搜榜单，查看当日热点事件和话题趋势。`;

  // 生成keywords - 包含所有热搜话题（前20个）+ 固定关键词
  const topicKeywords = realHotSearches
    .slice(0, 20)
    .map(item => cleanTopicTitle(item.title))
    .filter(topic => topic.length > 0);

  const baseKeywords = [
    '微博热搜',
    `${date}热搜`,
    '热搜榜单',
    '微博榜单',
    '热点事件',
    '社会热点',
    formattedDate.replace('年', '').replace('月', '').replace('日', '')
  ];

  const keywords = [...baseKeywords, ...topicKeywords];

  return {
    title,
    description,
    keywords
  };
} 
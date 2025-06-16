import { MetadataRoute } from 'next'
import dayjs from 'dayjs'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://weibo-trending-hot-history.vercel.app'

    // 生成从2024-05-20到今天的所有日期
    const startDate = dayjs('2024-05-20')
    const endDate = dayjs()
    const dates: string[] = []

    let currentDate = startDate
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
        dates.push(currentDate.format('YYYY-MM-DD'))
        currentDate = currentDate.add(1, 'day')
    }

    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...dates.map(date => ({
            url: `${baseUrl}/hots/${date}`,
            lastModified: dayjs(date).isSame(dayjs(), 'day') ? new Date() : dayjs(date).toDate(),
            changeFrequency: 'daily' as const,
            priority: dayjs(date).isSame(dayjs(), 'day') ? 0.9 : 0.7,
        }))
    ]

    return routes
} 
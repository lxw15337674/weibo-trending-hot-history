import dayjs from "dayjs";
import { SavedWeibo } from "./type";
import fs from 'fs/promises';

export function createList(words: SavedWeibo[]): string {
    const lastUpdateTime = dayjs().format('YYYY-MM-DD h:mm A');
    const listItems = words.map((item, index) => {
        const title = item.title;
        const url = item.url;
        const category = item.category ? `\`${item.category.trim()}\`` : '';
        const hot = item.hot;
        return `${index + 1}. [${title}](${url}) ${category} - ${hot}`;
    });

    return `
<!-- BEGIN -->

**最后更新时间**：${lastUpdateTime}
${listItems.join('\n')}

<!-- END -->
`;
}

export function createArchive(words: SavedWeibo[],date:string): string {
    return `# ${date}\n
共 ${words.length} 条\n
${createList(words)}
`;
}



export const ensureDir = async (dir: string) => {
    try {
        await fs.stat(dir);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.mkdir(dir, { recursive: true });
        } else {
            throw err;
        }
    }
};


export const writeFile = async (path: string, data: string) => {
    try {
        await fs.writeFile(path, data, { encoding: 'utf8' })
    } catch (err) {
        throw err;
    }
}

// 如果没有文件，就创建一个空文件
export const readFile = async (path: string) => {
    try {
        const data = await fs.readFile(path, 'utf8');
        return data;
    } catch (err) {
        if (err.code === 'ENOENT') {
            await writeFile(path, '');
            return '';
        }
    }
};
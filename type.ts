export interface WeiboItem {
    desc: string;
    desc_extr: string;
    scheme: string;
    category: string;
    description: string;
    promotion: any;
}

export interface Detail {
    category?: string;
    desc?: string;
    readCount?: number;
    discussCount?: number;
    origin?: number;
}
export interface SavedWeibo {
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
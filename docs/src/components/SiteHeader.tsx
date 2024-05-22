'use client'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ModeToggle } from "./ModeToggle"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
//    {item.category && <Badge>{item.category.trim()}</Badge>}
// { item.ads && <Badge variant="destructive">推广</Badge> }
// { <Badge variant="outline">🔥 {item?.hot ?? 0}</Badge> }
// { item.readCount && <Badge variant="outline">阅读 {item.readCount}</Badge> }
// { item.discussCount && <Badge variant="outline">讨论 {item.discussCount}</Badge> }
// { item.origin && <Badge variant="outline">原创 {item.origin}</Badge> }
const sortConfig = [
    {
        label: "热度",
        value: "hot"
    },
    {
        label: "阅读",
        value: "readCount"
    },
    {
        label: "讨论",
        value: "discussCount"
    },
    {
        label: "原创",
        value: "origin"
    },
]
export function SiteHeader() {
    const pathname = usePathname()
    const router = useRouter();
    const params = useSearchParams();
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div>
                    <Select defaultValue={params.get('sort') || 'hot'}
                        onValueChange={(v) => {
                            router.push(`${pathname}?sort=${v}`)
                        }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                sortConfig.map((item) => {
                                    return <SelectGroup key={item.value}>
                                        <SelectItem value={item.value}>
                                            按{item.label}排序
                                            </SelectItem>
                                    </SelectGroup>
                                })
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center">
                        <ModeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}

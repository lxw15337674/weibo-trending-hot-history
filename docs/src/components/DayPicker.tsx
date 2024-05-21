"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from "next/navigation"

interface DatePickerProps {
    value: string
}
export function DatePicker(props: DatePickerProps) {
    const date = new Date(props.value)
    const router = useRouter()
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"ghost"}
                    className={cn(
                        " justify-start text-left font-normal h-8 px-10",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "yyyy-MM-dd") : "选择日期"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date)=>{
                        router.push(`/hots/${format(date, "yyyy-MM-dd")}`)
                    }}
                    initialFocus
                    disabled={(date) => {
                        return date > new Date();
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}

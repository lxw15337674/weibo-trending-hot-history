'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AISearchButtonProps {
  title: string;
  className?: string;
}

export function AISearchButton({ title, className = "" }: AISearchButtonProps) {
  const handleAIClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const aiUrl = `https://s.weibo.com/aisearch?q=%23${encodeURIComponent(title)}%23&Refer=weibo_aisearch`;
    window.open(aiUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handleAIClick}
      className={cn(
        "h-8 px-3 text-xs",
        "border border-border bg-background text-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-colors",
        className
      )}
      aria-label={`AI搜索话题：${title}`}
    >
      🤖 AI
    </Button>
  );
}
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Tab {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  link: string;
}

interface ExpandableTabsProps {
  tabs: Tab[];
  onChange?: (index: number | null) => void;
  selectedIndex?: number | null;
  className?: string;
}

export function ExpandableTabs({
  tabs,
  onChange,
  selectedIndex = 0,
  className,
}: ExpandableTabsProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleTabClick = (index: number) => {
    if (onChange) {
      onChange(index);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const scrollToTab = (index: number) => {
    const tabElement = containerRef.current?.children[index] as HTMLElement;
    if (tabElement && scrollContainerRef.current) {
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const tabRect = tabElement.getBoundingClientRect();
      
      const scrollLeft = tabElement.offsetLeft - 
        (containerRect.width - tabRect.width) / 2 + 
        scrollContainerRef.current.scrollLeft;
      
      scrollContainerRef.current.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: "smooth"
      });
    }
  };

  React.useEffect(() => {
    if (selectedIndex !== undefined && selectedIndex !== null) {
      scrollToTab(selectedIndex);
    }
  }, [selectedIndex]);

  const visibleTabs = isExpanded ? tabs : tabs.slice(0, 3);
  const showMoreIndicator = tabs.length > 3 && !isExpanded;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm",
        className
      )}
    >
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div 
          ref={containerRef}
          className="flex items-center gap-2 min-w-max"
        >
          {visibleTabs.map((tab, index) => {
            const isSelected = selectedIndex === index;
            const Icon = tab.icon;
            
            return (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                style={{
                  transform: `translateX(${-scrollLeft}px)`,
                }}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showMoreIndicator && (
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent"
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          <span className="text-xs text-muted-foreground">+{tabs.length - 3}</span>
        </div>
      )}
    </div>
  );
}
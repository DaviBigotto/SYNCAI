"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Command, Search, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  
  // Transform /dashboard/videos into ['dashboard', 'videos']
  const segments = pathname.split('/').filter(Boolean);

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[var(--sidebar-border)] bg-[var(--background)]/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="md:hidden mr-2 flex items-center">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[240px] bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]">
              <Sidebar mobile />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
            
            return (
              <div key={segment} className="flex items-center gap-2">
                <span className={isLast ? "text-foreground font-medium" : "text-muted-foreground hidden sm:inline-block"}>
                  {formattedSegment}
                </span>
                {!isLast && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 hidden sm:inline-block" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Fake Search Bar for Premium Feel */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--sidebar)] border border-[var(--sidebar-border)] rounded-md text-muted-foreground text-xs">
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <div className="flex items-center gap-0.5 ml-8 bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>
    </header>
  );
}

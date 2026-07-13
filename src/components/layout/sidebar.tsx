"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Settings, Video, Activity, Zap, ChevronLeft, ChevronRight, ChevronsUpDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Visão Geral",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Vídeos",
    icon: Video,
    href: "/dashboard/videos",
  },
  {
    label: "Integrações",
    icon: Settings,
    href: "/dashboard/settings",
  },
  {
    label: "Logs",
    icon: Activity,
    href: "/dashboard/logs",
  },
];

export function Sidebar({ mobile }: { mobile?: boolean }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ width: mobile ? "100%" : 240 }}
      animate={{ width: mobile ? "100%" : (isCollapsed ? 64 : 240) }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col bg-[var(--sidebar)] border-[var(--sidebar-border)] z-50 shrink-0",
        mobile ? "h-full w-full border-r-0" : "h-full border-r"
      )}
    >
      {/* Workspace Selector */}
      <div className="h-14 px-3 flex items-center shrink-0 border-b border-[var(--sidebar-border)]">
        <div className={cn("flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-white/5 cursor-pointer transition-colors", isCollapsed && !mobile && "justify-center")}>
          <div className="flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-primary fill-primary" />
          </div>
          {(!isCollapsed || mobile) && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-lg font-bold tracking-tight whitespace-nowrap text-foreground leading-none font-heading">
                SyncAI
              </span>
            </div>
          )}
        </div>
      </div>

      {!mobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-16 w-6 h-6 bg-[var(--sidebar)] border border-[var(--sidebar-border)] rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-50 shadow-sm cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      )}

      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {routes.map((route) => {
          const isActive = pathname === route.href;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group relative flex items-center h-10 md:h-9 px-3 rounded-md transition-all duration-200 cursor-pointer overflow-hidden",
                isActive 
                  ? "text-primary font-medium bg-primary/10" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <div className="relative z-10 flex items-center gap-3 w-full">
                <route.icon className={cn("w-5 h-5 md:w-4 md:h-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                
                <AnimatePresence>
                  {(!isCollapsed || mobile) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap text-sm"
                    >
                      {route.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 mt-auto border-t border-[var(--sidebar-border)]">
        <div className={cn("flex items-center gap-2 px-2 py-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer", isCollapsed && !mobile && "justify-center")}>
          <div className="w-7 h-7 rounded-full bg-secondary border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
            <span className="text-xs font-medium text-foreground">D</span>
          </div>
          {(!isCollapsed || mobile) && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-foreground truncate">Davi</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-accent" />
                <span className="text-[11px] text-muted-foreground font-medium">Pro Plan</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

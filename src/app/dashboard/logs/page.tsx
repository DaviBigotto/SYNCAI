"use client";

import { useState } from "react";
import { Terminal, Activity, XCircle, CheckCircle2, Info, Search, Filter, Trash } from "lucide-react";

export default function LogsPage() {
  const [logs] = useState([
    { id: 1, time: "14:30:02", type: "info", message: "[Sync Worker] Verificando novos vídeos na conta @user_tiktok..." },
    { id: 2, time: "14:30:04", type: "info", message: "[Sync Worker] Nenhum novo vídeo encontrado na última varredura." },
    { id: 3, time: "14:45:01", type: "info", message: "[Sync Worker] Verificando novos vídeos na conta @user_tiktok..." },
    { id: 4, time: "14:45:05", type: "success", message: "[Sync Worker] 1 novo vídeo detectado (ID: #8928374). Baixando metadados..." },
    { id: 5, time: "14:45:12", type: "info", message: "[Processing] Iniciando download do vídeo sem marca d'água." },
    { id: 6, time: "14:45:30", type: "info", message: "[Upload] Iniciando envio para a API do Instagram Reels (Conta: @user_insta)..." },
    { id: 7, time: "14:46:02", type: "success", message: "[Success] Vídeo publicado no Instagram com sucesso! (ID: #9933221)" },
    { id: 8, time: "15:00:00", type: "error", message: "[Error] Rate limit exceeded from Meta Graph API. Backing off for 5 minutes." },
  ]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Logs do Sistema</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Output detalhado de execuções do RelaySocial em tempo real.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-[#000000] border border-[var(--sidebar-border)] rounded-xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/5">
        {/* Terminal Header */}
        <div className="h-10 border-b border-white/10 flex items-center justify-between px-4 bg-[#0A0A0A] shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground tracking-wide font-mono">Console</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors px-2">
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </div>
            <div className="h-3.5 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors px-2">
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filter</span>
            </div>
            <div className="h-3.5 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors px-2">
              <Trash className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </div>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 font-mono text-[13px] leading-relaxed select-text">
          <div className="flex flex-col gap-1.5">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 hover:bg-white/[0.02] py-0.5 px-1 -mx-1 rounded transition-colors group">
                <span className="text-white/30 shrink-0 w-16 group-hover:text-white/50 transition-colors">{log.time}</span>
                
                {log.type === 'info' && <Info className="w-4 h-4 text-blue-400/80 shrink-0 mt-0.5" />}
                {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                {log.type === 'error' && <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                
                <span className={`break-all ${
                  log.type === 'error' ? 'text-red-400/90' : 
                  log.type === 'success' ? 'text-emerald-400/90' : 
                  'text-white/70'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
            
            {/* Blinking cursor / Waiting state */}
            <div className="flex items-center gap-4 py-0.5 px-1 -mx-1 mt-4 text-white/30">
              <Activity className="w-4 h-4 animate-pulse shrink-0" />
              <span className="flex items-center gap-1">
                Aguardando novos eventos <span className="inline-block w-1.5 h-3.5 bg-white/50 animate-pulse ml-1"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Camera, Download, UploadCloud, CheckCircle2, Play, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { icon: Camera, label: "Monitorando", status: "completed" },
  { icon: Play, label: "Novo Vídeo", status: "completed" },
  { icon: Download, label: "Baixando", status: "completed" },
  { icon: Activity, label: "Processando", status: "current" },
  { icon: UploadCloud, label: "Publicando", status: "upcoming" },
  { icon: CheckCircle2, label: "Concluído", status: "upcoming" },
];

export function AiEngineStepper() {
  return (
    <div className="w-full flex flex-col p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="mb-6 flex items-center justify-between z-10">
        <div>
          <h3 className="text-sm font-semibold font-heading text-foreground">AI Engine</h3>
          <p className="text-xs text-muted-foreground mt-1">Monitorando novas oportunidades...</p>
        </div>
      </div>

      <div className="relative flex justify-between items-center w-full z-10 mt-4">
        {/* Connection Line Background */}
        <div className="absolute top-4 left-0 right-0 h-[1px] bg-border -z-10" />
        
        {/* Connection Line Active */}
        <div 
          className="absolute top-4 left-0 h-[1px] bg-primary -z-10 transition-all duration-1000 ease-in-out"
          style={{ width: "50%" }}
        />

        {steps.map((step, idx) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          
          return (
            <div key={idx} className="flex flex-col items-center gap-3 relative">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted ? "bg-primary border-primary text-primary-foreground" :
                  isCurrent ? "bg-background border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]" :
                  "bg-background border-border text-muted-foreground"
                )}
              >
                <step.icon className="w-3.5 h-3.5" />
              </div>
              <span className={cn(
                "text-[10px] font-medium absolute -bottom-5 whitespace-nowrap",
                isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-4" />
    </div>
  );
}

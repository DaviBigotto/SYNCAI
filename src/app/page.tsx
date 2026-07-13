import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Play, ArrowRight, CheckCircle2, LayoutDashboard, Video } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] selection:bg-primary/30 selection:text-white flex flex-col font-sans">
      
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#09090b]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold font-heading tracking-tight text-white">SyncAI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block">
              Login
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-white hover:bg-primary/90 transition-colors">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>
            SyncAI Engine v2.0 disponível
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-heading max-w-4xl mx-auto mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Automatize sua distribuição de conteúdo com <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Inteligência</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Conecte sua conta do TikTok e nós publicamos automaticamente seus vídeos no Instagram Reels. Sem marcas d'água, sem trabalho manual.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                Criar conta gratuita
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                Ver como funciona
              </Button>
            </Link>
          </div>
          
          {/* Dashboard Preview */}
          <div className="mt-20 w-full max-w-5xl mx-auto rounded-xl border border-white/10 bg-[#111113]/50 backdrop-blur-xl shadow-2xl p-2 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#09090b] opacity-80 pointer-events-none" />
            <div className="rounded-lg border border-white/5 bg-[#09090b] flex items-center justify-center p-8 min-h-[400px]">
              {/* Mock Dashboard UI Elements */}
              <div className="w-full flex flex-col gap-6 opacity-70">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg"></div>
                    <div className="w-32 h-4 bg-white/10 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-white/5 rounded-md"></div>
                    <div className="w-24 h-8 bg-primary/20 rounded-md"></div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white/5 rounded-lg border border-white/5"></div>)}
                </div>
                <div className="flex gap-4 h-48">
                  <div className="w-2/3 bg-white/5 rounded-lg border border-white/5"></div>
                  <div className="w-1/3 bg-white/5 rounded-lg border border-white/5"></div>
                </div>
              </div>
            </div>
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-md cursor-pointer hover:scale-110 transition-transform shadow-[0_0_30px_rgba(59,130,246,0.6)]">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>
          </div>
          
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <span className="font-semibold font-heading text-white">SyncAI</span>
            <span>© 2024. Todos os direitos reservados.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Termos</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacidade</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

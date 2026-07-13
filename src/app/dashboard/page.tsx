import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Zap, ArrowUpRight, BarChart3, Clock, ArrowRight, Video, AlertCircle, Camera, Calendar, CheckCircle } from "lucide-react";
import { Overview } from "@/components/dashboard/overview";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Real data fetching
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalVideos,
    videosHoje,
    publicadosTotal,
    publicadosHoje,
    pendentes,
    falhas,
    recentLogs
  ] = await Promise.all([
    prisma.video.count({ where: { userId } }),
    prisma.video.count({ where: { userId, createdAt: { gte: startOfToday } } }),
    prisma.video.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.video.count({ where: { userId, status: 'COMPLETED', updatedAt: { gte: startOfToday } } }),
    prisma.video.count({ where: { userId, status: 'PENDING' } }),
    prisma.video.count({ where: { userId, status: 'FAILED' } }),
    prisma.syncLog.findMany({
      where: { userId },
      take: 4,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  // Tempo Economizado (Mocked based on published videos: 15 mins per video)
  const savedMinutes = publicadosTotal * 15;
  const savedHours = Math.floor(savedMinutes / 60);
  const remainingMinutes = savedMinutes % 60;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Boa noite, {session.user.name?.split(' ')[0] || "Usuário"} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Seu SyncAI está trabalhando para você.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/videos">
            <Button className="h-9 px-4 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20">
              <Zap className="w-4 h-4 mr-2" />
              Sincronizar Agora
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[var(--card)] border-[var(--sidebar-border)] shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-5 flex flex-col gap-4">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2"><Video className="w-4 h-4"/> Vídeos Hoje</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold font-heading tracking-tight text-foreground leading-none">{videosHoje}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[var(--card)] border-[var(--sidebar-border)] shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-success/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-5 flex flex-col gap-4">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Publicações Hoje</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold font-heading tracking-tight text-foreground leading-none">{publicadosHoje}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--sidebar-border)] shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-5 flex flex-col gap-4">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Falhas</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold font-heading tracking-tight text-foreground leading-none">{falhas}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--sidebar-border)] shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-5 flex flex-col gap-4">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4"/> Tempo Economizado</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold font-heading tracking-tight text-foreground leading-none">{savedHours}h {savedMinutes > 0 ? remainingMinutes + 'm' : ''}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Top Metrics (Minimalist Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-[var(--card)] border-[var(--border)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Video className="w-16 h-16 text-primary" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vídeos Sincronizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading">{totalVideos}</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--border)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Play className="w-16 h-16 text-success" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Publicados no Reels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading">{publicadosTotal}</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--border)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="w-16 h-16 text-warning" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aguardando Processamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading">{pendentes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Na fila da inteligência artificial
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--border)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertCircle className="w-16 h-16 text-destructive" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Falhas de Postagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading">{falhas}</div>
            <p className="text-xs text-destructive font-medium mt-1 flex items-center">
              Requer atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. AI Stepper & Progress */}
      {pendentes > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-[var(--border)] p-4 md:p-6 overflow-x-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between min-w-[600px] sm:min-w-0">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                <Zap className="w-5 h-5 text-primary fill-primary animate-pulse" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm md:text-base">AI Engine Ativo</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Processando {pendentes} vídeos na fila de espera</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-1 mt-4 sm:mt-0 px-0 sm:px-8">
              <div className="h-1 flex-1 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-gradient-to-r from-primary to-accent rounded-full relative">
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 animate-pulse blur-[2px]"></div>
                </div>
              </div>
            </div>
            
            <Link href="/dashboard/videos">
              <Button variant="ghost" size="sm" className="hidden md:flex text-primary hover:text-primary hover:bg-primary/10 ml-auto shrink-0">
                Ver Fila Completa <ArrowRight className="ml-2 w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* 4. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Gráfico */}
        <Card className="lg:col-span-4 bg-[var(--card)] border-[var(--border)] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <BarChart3 className="w-5 h-5 text-primary" />
              Desempenho da Última Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <Overview />
          </CardContent>
        </Card>
        
        {/* Real-time Activity Feed */}
        <Card className="lg:col-span-3 bg-[var(--card)] border-[var(--sidebar-border)] shadow-sm flex flex-col">
          <CardHeader className="p-5 border-b border-[var(--sidebar-border)] flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold font-heading">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="flex flex-col p-2">
              {recentLogs.length > 0 ? recentLogs.map((log) => {
                let Icon = Calendar;
                let color = "text-muted-foreground";
                let bg = "bg-white/5";

                if (log.action === "INSTAGRAM_POST" && log.status === "SUCCESS") {
                  Icon = Camera; color = "text-pink-500"; bg = "bg-pink-500/10";
                } else if (log.action === "TIKTOK_DISCOVERY") {
                  Icon = Video; color = "text-blue-500"; bg = "bg-blue-500/10";
                } else if (log.status === "ERROR") {
                  Icon = AlertCircle; color = "text-amber-500"; bg = "bg-amber-500/10";
                }

                return (
                  <div key={log.id} className="p-3 flex gap-4 hover:bg-white-[0.02] rounded-lg transition-colors group cursor-default">
                    <div className={`mt-0.5 shrink-0 w-8 h-8 rounded flex items-center justify-center ${bg}`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex flex-col gap-0.5 justify-center">
                      <p className="text-sm text-foreground font-medium leading-none">
                        {log.message || log.action}
                      </p>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(log.createdAt).toLocaleDateString('pt-BR')} às {new Date(log.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )
              }) : (
                <div className="p-8 text-center flex flex-col items-center">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">Nenhuma atividade recente.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

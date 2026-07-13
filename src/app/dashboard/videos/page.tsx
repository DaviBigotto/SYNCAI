import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, MoreHorizontal, Play, CheckCircle2, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SyncButton } from "@/components/dashboard/sync-button";
import { PublishButton } from "@/components/dashboard/publish-button";
import { DeleteButton } from "@/components/dashboard/delete-button";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default async function VideosPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const videos = await prisma.video.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Fila de Publicação</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Seus vídeos mais recentes prontos para serem distribuídos.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex items-center w-full sm:w-auto">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar..." 
              className="pl-9 w-full sm:w-[200px] h-12 sm:h-9 bg-[var(--sidebar)] border-[var(--sidebar-border)] text-sm md:text-base rounded-md focus-visible:ring-1 focus-visible:ring-[var(--ring)] transition-all"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 sm:flex-none h-12 sm:h-9 bg-[var(--sidebar)] border-[var(--sidebar-border)] hover:bg-white/5 hover:text-foreground shadow-sm">
              <Filter className="mr-2 h-4 w-4 sm:h-3.5 sm:w-3.5" /> Filtros
            </Button>
            <div className="flex-1 sm:flex-none">
              <SyncButton />
            </div>
          </div>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 mt-4 border border-dashed border-[var(--sidebar-border)] rounded-xl bg-[var(--sidebar)]/50">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Play className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground">Nenhum vídeo na fila</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm text-center">
            Clique em "Sincronizar Agora" para buscar os últimos conteúdos do seu TikTok.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video: any) => (
            <div key={video.id} className="group relative flex flex-col bg-[var(--card)] border border-[var(--sidebar-border)] rounded-xl overflow-hidden hover:border-white/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              
              {/* Thumbnail Container */}
              <div className="relative aspect-[4/5] sm:aspect-[9/16] w-full bg-[#09090b] overflow-hidden">
                {video.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={video.coverUrl} alt={video.description || "Video cover"} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                ) : (
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                )}
                
                {/* Gradient Overlay bottom to top */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                {/* Play Overlay (appears on hover) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-md transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  {video.status === 'COMPLETED' && (
                    <Badge variant="secondary" className="bg-success text-success-foreground border-transparent shadow-sm">
                      <CheckCircle2 className="mr-1.5 h-3 w-3" /> Publicado
                    </Badge>
                  )}
                  {video.status === 'PENDING' && (
                    <Badge variant="secondary" className="bg-primary text-primary-foreground border-transparent shadow-sm">
                      <Clock className="mr-1.5 h-3 w-3" /> Pendente
                    </Badge>
                  )}
                  {video.status === 'FAILED' && (
                    <Badge variant="secondary" className="bg-destructive text-destructive-foreground border-transparent shadow-sm">
                      <AlertCircle className="mr-1.5 h-3 w-3" /> Falhou
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium backdrop-blur-md border border-white/10">
                  00:45
                </div>
              </div>

              {/* Content & Actions */}
              <div className="p-4 flex flex-col flex-1 bg-[var(--card)] z-10 -mt-2">
                <p className="text-sm font-semibold font-heading text-foreground line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
                  {video.description || "Sem descrição"}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {new Date(video.createdAt).toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' })}, 14:30
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {video.status === 'PENDING' || video.status === 'FAILED' ? (
                      <PublishButton videoId={video.id} />
                    ) : (
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                    <DeleteButton videoId={video.id} />
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-[var(--sidebar-border)] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-sm bg-zinc-800 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                    </div>
                    <div className="w-5 h-5 rounded-sm bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center">
                      <InstagramIcon className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                    <span className="flex items-center gap-1"><Play className="w-3 h-3" /> 12.4k</span>
                    <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> 1.2k</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

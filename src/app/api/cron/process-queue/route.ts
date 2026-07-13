import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { SyncService } from "@/services/SyncService";

export const maxDuration = 300; // Permitir até 5 minutos de processamento

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (
    process.env.CRON_SECRET && 
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log("Iniciando fila de processamento em background...");
    
    // Pegar até 3 vídeos pendentes por vez para não estourar os limites de API e tempo
    const pendingVideos = await prisma.video.findMany({
      where: { status: "PENDING" },
      take: 3,
      orderBy: { createdAt: "asc" } // Os mais antigos primeiro
    });

    if (pendingVideos.length === 0) {
      return new Response(JSON.stringify({ message: "Nenhum vídeo pendente na fila." }), { status: 200 });
    }

    const syncService = new SyncService();
    let processed = 0;

    for (const video of pendingVideos) {
      console.log(`Processando vídeo ${video.id} em background...`);
      // O processPendingVideo já gerencia logs de sucesso e erro e muda o status
      await syncService.processPendingVideo(video.id);
      processed++;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processamento da fila finalizado. ${processed} vídeos processados.` 
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error: any) {
    console.error("Erro fatal no processador de fila:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

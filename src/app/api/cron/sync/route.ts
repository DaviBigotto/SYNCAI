import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { SyncService } from "@/services/SyncService";

export const maxDuration = 300; // 5 minutos para processar múltiplos usuários

export async function GET(req: NextRequest) {
  // Segurança básica: Checar CRON_SECRET (se configurado na Vercel)
  const authHeader = req.headers.get('authorization');
  if (
    process.env.CRON_SECRET && 
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log("Iniciando AutoSync para todos os usuários habilitados...");
    
    // Busca todos os usuários com autoSync ativado
    const usersWithAutoSync = await prisma.settings.findMany({
      where: { autoSync: true },
      select: { userId: true }
    });

    if (usersWithAutoSync.length === 0) {
      return new Response(JSON.stringify({ message: "Nenhum usuário com autoSync ativado." }), { status: 200 });
    }

    const syncService = new SyncService();
    let totalNewVideos = 0;

    // Idealmente, poderíamos rodar em paralelo (Promise.all), mas para não sobrecarregar
    // as APIs e o banco, rodamos sequencialmente.
    for (const user of usersWithAutoSync) {
      try {
        const result = await syncService.discoverNewVideos(user.userId);
        totalNewVideos += result.newVideosCount;
      } catch (error: any) {
        console.error(`Erro ao sincronizar usuário ${user.userId}:`, error.message);
        // Continua para o próximo usuário mesmo se um falhar
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `AutoSync finalizado. ${totalNewVideos} novos vídeos adicionados à fila de ${usersWithAutoSync.length} usuários.` 
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error: any) {
    console.error("Erro fatal no AutoSync:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

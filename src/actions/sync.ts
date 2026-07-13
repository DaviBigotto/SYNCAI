"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { TikTokProvider } from "@/services/social-media/TikTokProvider"

export async function triggerTikTokSync() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const userId = session.user.id;

  const settings = await prisma.settings.findUnique({
    where: { userId },
  })

  if (!settings?.tiktokUsername) {
    throw new Error("Conta do TikTok não configurada")
  }

  const provider = new TikTokProvider();
  
  try {
    // LIMPANDO OS VÍDEOS DE TESTE TEMPORARIAMENTE
    await prisma.video.deleteMany({
      where: {
        OR: [
          { description: { contains: 'Next.js 15' } },
          { description: { contains: 'Neon #postgres' } },
          { description: { contains: 'Teste de vídeo sincronizado' } }
        ]
      }
    });

    // 1. Busca os posts recentes (Neste MVP será nosso Mock Avançado)
    const posts = await provider.fetchRecentPosts(settings.tiktokUsername);
    
    let addedCount = 0;

    // 2. Insere os novos vídeos no Banco de Dados
    for (const post of posts) {
      // Usamos upsert para evitar vídeos duplicados na fila
      const video = await prisma.video.upsert({
        where: {
          userId_originalId: {
            userId,
            originalId: post.id
          }
        },
        update: {
          // Atualiza a data de criação com a data real do vídeo do TikTok
          createdAt: post.createdAt,
          originalUrl: post.mediaUrl,
          coverUrl: post.coverUrl
        }, 
        create: {
          userId,
          originalId: post.id,
          originalUrl: post.mediaUrl,
          coverUrl: post.coverUrl,
          description: post.description,
          status: "PENDING",
          createdAt: post.createdAt // Força a data original do vídeo
        }
      });
      
      // Checa se acabou de ser criado (CreatedAt igual a UpdatedAt)
      if (video.createdAt.getTime() === video.updatedAt.getTime()) {
        addedCount++;
      }
    }

    // Registra o evento de sucesso nos Logs
    await prisma.syncLog.create({
      data: {
        userId,
        action: "TIKTOK_FETCH",
        status: "SUCCESS",
        message: `${addedCount} novos vídeos encontrados na conta @${settings.tiktokUsername}`
      }
    });

    revalidatePath("/dashboard/videos")
    revalidatePath("/dashboard/logs")
    
    return { success: true, count: addedCount }

  } catch (error: any) {
    console.error("🔥 ERRO REAL NO SYNC:", error);
    await prisma.syncLog.create({
      data: {
        userId,
        action: "TIKTOK_FETCH",
        status: "ERROR",
        message: error.message || "Erro desconhecido ao buscar vídeos"
      }
    });
    throw new Error("Falha ao buscar os vídeos do TikTok");
  }
}

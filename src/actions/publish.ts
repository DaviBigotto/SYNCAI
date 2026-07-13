"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { InstagramProvider } from "@/services/social-media/InstagramProvider"

export async function publishVideoAction(videoId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const userId = session.user.id;

  // 1. Busca o vídeo no banco de dados
  const video = await prisma.video.findUnique({
    where: { id: videoId, userId }
  });

  if (!video) {
    throw new Error("Vídeo não encontrado.");
  }

  if (video.status === 'COMPLETED') {
    throw new Error("Vídeo já foi publicado.");
  }

  // 1.5 Busca as configurações do usuário
  const settings = await prisma.settings.findUnique({
    where: { userId }
  });

  if (!settings || !settings.instagramAccessToken || !settings.instagramAccountId) {
    throw new Error("Por favor, configure suas chaves do Instagram na aba Configurações.");
  }

  const provider = new InstagramProvider(
    settings.instagramAccessToken, 
    settings.instagramAccountId
  );
  
  try {
    // 2. Tenta publicar no Instagram Real
    const result = await provider.publishPost(video.originalUrl, video.description || "");

    // 3. Sucesso! Marca no banco de dados
    await prisma.video.update({
      where: { id: videoId },
      data: { 
        status: "COMPLETED",
        instagramReelId: result.mediaId
      }
    });

    await prisma.syncLog.create({
      data: {
        userId,
        action: "INSTAGRAM_POST",
        status: "SUCCESS",
        message: `Reel publicado com sucesso (ID: ${result.mediaId})`
      }
    });

    revalidatePath("/dashboard/videos")
    return { success: true }

  } catch (error: any) {
    // Falha: Pode ser erro de Token, limite de API, etc.
    await prisma.video.update({
      where: { id: videoId },
      data: { status: "FAILED" }
    });

    await prisma.syncLog.create({
      data: {
        userId,
        action: "INSTAGRAM_POST",
        status: "ERROR",
        message: error.message || "Erro desconhecido ao postar no Instagram"
      }
    });

    throw new Error(error.message || "Falha ao publicar o vídeo.");
  }
}

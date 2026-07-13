import prisma from "@/lib/prisma";
import { TikTokProvider } from "./social-media/TikTokProvider";
import { InstagramProvider } from "./social-media/InstagramProvider";

export class SyncService {
  private tiktokProvider: TikTokProvider;
  private instagramProvider: InstagramProvider;

  constructor() {
    this.tiktokProvider = new TikTokProvider();
    this.instagramProvider = new InstagramProvider();
  }

  /**
   * Procura novos vídeos no TikTok do usuário e adiciona à fila de sincronização.
   */
  async discoverNewVideos(userId: string) {
    try {
      const settings = await prisma.settings.findUnique({ where: { userId } });
      
      if (!settings || !settings.tiktokUsername) {
        throw new Error("Usuário não possui conta do TikTok configurada.");
      }

      // 1. Busca os vídeos mais recentes na plataforma
      const recentPosts = await this.tiktokProvider.fetchRecentPosts(settings.tiktokUsername);

      let newVideosCount = 0;

      // 2. Verifica se o vídeo já existe no nosso banco de dados
      for (const post of recentPosts) {
        const existingVideo = await prisma.video.findUnique({
          where: {
            userId_originalId: {
              userId,
              originalId: post.id,
            }
          }
        });

        // 3. Se não existir, salva para processamento (Fila)
        if (!existingVideo) {
          await prisma.video.create({
            data: {
              userId,
              originalId: post.id,
              originalUrl: post.mediaUrl,
              description: post.description,
              status: "PENDING", // Fica pendente até a Fila (Queue) processar
            }
          });
          newVideosCount++;
        }
      }

      await prisma.syncLog.create({
        data: {
          userId,
          action: "TIKTOK_DISCOVERY",
          status: "SUCCESS",
          message: `Encontrados ${newVideosCount} novos vídeos para sincronizar.`,
        }
      });

      return { success: true, newVideosCount };

    } catch (error: any) {
      await prisma.syncLog.create({
        data: {
          userId,
          action: "TIKTOK_DISCOVERY",
          status: "ERROR",
          message: error.message,
        }
      });
      throw error;
    }
  }

  /**
   * Processa um vídeo pendente e posta no Instagram.
   * Em produção, isso deve ser chamado por um worker (fila).
   */
  async processPendingVideo(videoId: string) {
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video || video.status !== "PENDING") return;

    try {
      // Atualiza o status para PROCESSING
      await prisma.video.update({
        where: { id: videoId },
        data: { status: "PROCESSING" }
      });

      // OBS: Em um cenário real, primeiro faríamos o download do vídeo do TikTok
      // sem marca d'água (via uma API externa) e depois faríamos o upload.
      
      // Simulação do Download + Upload
      const mediaUrl = `https://mock-download-server.com/video/${video.originalId}.mp4`;
      
      const settings = await prisma.settings.findUnique({ where: { userId: video.userId } });
      this.instagramProvider = new InstagramProvider(
        settings?.instagramAccessToken || undefined, 
        settings?.instagramAccountId || undefined
      );

      const result = await this.instagramProvider.publishPost(mediaUrl, video.description || "");

      if (result.success) {
        await prisma.video.update({
          where: { id: videoId },
          data: { 
            status: "COMPLETED",
            instagramReelId: result.postId
          }
        });

        await prisma.syncLog.create({
          data: {
            userId: video.userId,
            action: "INSTAGRAM_POST",
            status: "SUCCESS",
            message: `Vídeo ${video.originalId} postado no Instagram com sucesso.`,
          }
        });
      }

    } catch (error: any) {
      await prisma.video.update({
        where: { id: videoId },
        data: { status: "FAILED" }
      });

      await prisma.syncLog.create({
        data: {
          userId: video.userId,
          action: "INSTAGRAM_POST",
          status: "ERROR",
          message: error.message,
        }
      });
    }
  }
}

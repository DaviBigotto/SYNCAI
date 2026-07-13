import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import axios from "axios";

export const maxDuration = 60; // Configuração para Vercel para permitir requests mais longos que 15s

export async function GET(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return new Response("Não autorizado", { status: 401 });
  }

  const userId = session.user.id;
  const searchParams = req.nextUrl.searchParams;
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return new Response("Video ID is required", { status: 400 });
  }

  // Configuração para Server-Sent Events (SSE)
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        sendEvent({ status: "Iniciando processo de publicação..." });

        const video = await prisma.video.findUnique({
          where: { id: videoId, userId }
        });

        if (!video) {
          throw new Error("Vídeo não encontrado.");
        }

        if (video.status === 'COMPLETED') {
          throw new Error("Vídeo já foi publicado.");
        }

        const settings = await prisma.settings.findUnique({
          where: { userId }
        });

        if (!settings || !settings.instagramAccessToken || !settings.instagramAccountId) {
          throw new Error("Por favor, configure suas chaves do Instagram na aba Configurações.");
        }

        const { instagramAccessToken, instagramAccountId } = settings;

        sendEvent({ status: "Criando container no Instagram..." });

        // 1. Cria Container
        const containerResponse = await axios.post(
          `https://graph.facebook.com/v19.0/${instagramAccountId}/media`,
          null,
          {
            params: {
              media_type: "REELS",
              video_url: video.originalUrl,
              caption: video.description || "",
              access_token: instagramAccessToken
            }
          }
        );

        const containerId = containerResponse.data.id;
        if (!containerId) {
          throw new Error("Falha ao criar Container de Reel na Meta API");
        }

        sendEvent({ status: `Container criado. Aguardando processamento da Meta...` });

        // 2. Polling
        let isReady = false;
        let attempts = 0;
        
        while (!isReady && attempts < 15) {
          await new Promise(resolve => setTimeout(resolve, 3000));
          attempts++;
          
          sendEvent({ status: `Verificando status do Meta (Tentativa ${attempts}/15)...` });
          
          try {
            const statusRes = await axios.get(
              `https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${instagramAccessToken}`
            );
            const statusCode = statusRes.data.status_code;
            
            if (statusCode === 'FINISHED') {
              isReady = true;
            } else if (statusCode === 'ERROR') {
              throw new Error("A Meta encontrou um erro ao processar o arquivo de vídeo.");
            }
          } catch (err: any) {
             // Ignora erros temporários na checagem
          }
        }

        if (!isReady) {
          throw new Error("Tempo limite excedido. O Instagram demorou muito para processar o vídeo.");
        }

        sendEvent({ status: "Vídeo processado. Publicando no seu perfil..." });

        // 3. Publica Container
        const publishResponse = await axios.post(
          `https://graph.facebook.com/v19.0/${instagramAccountId}/media_publish`,
          null,
          {
            params: {
              creation_id: containerId,
              access_token: instagramAccessToken
            }
          }
        );

        const mediaId = publishResponse.data.id;

        await prisma.video.update({
          where: { id: videoId },
          data: { 
            status: "COMPLETED",
            instagramReelId: mediaId
          }
        });

        await prisma.syncLog.create({
          data: {
            userId,
            action: "INSTAGRAM_POST",
            status: "SUCCESS",
            message: `Reel publicado com sucesso (ID: ${mediaId})`
          }
        });

        sendEvent({ status: "Sucesso! Reel publicado.", done: true, success: true });
        
      } catch (error: any) {
        // Marca como falha
        await prisma.video.update({
          where: { id: videoId },
          data: { status: "FAILED" }
        }).catch(() => {});

        sendEvent({ 
          status: error.message || error.response?.data?.error?.message || "Erro desconhecido", 
          done: true, 
          error: true 
        });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}

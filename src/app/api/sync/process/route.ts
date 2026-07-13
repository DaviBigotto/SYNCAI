import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SyncService } from "@/services/SyncService";

export const maxDuration = 60; // Configuração Vercel: Permite execução por até 60 segundos (dependendo do plano Vercel)

export async function GET(request: Request) {
  try {
    // Esta rota deve ser protegida para ser chamada apenas por CRON job ou Worker interno
    const authHeader = request.headers.get("authorization");
    const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isCron && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized. This endpoint is for background jobs only." }, { status: 401 });
    }

    // Busca até 5 vídeos pendentes (limite para não dar timeout)
    const pendingVideos = await prisma.video.findMany({
      where: { status: "PENDING" },
      take: 5, 
      orderBy: { createdAt: "asc" }
    });

    if (pendingVideos.length === 0) {
      return NextResponse.json({ message: "No pending videos to process." });
    }

    const syncService = new SyncService();

    // Processa os vídeos (idealmente em paralelo ou com Promise.allSettled)
    const results = await Promise.allSettled(
      pendingVideos.map((video: { id: string }) => syncService.processPendingVideo(video.id))
    );

    const successCount = results.filter((r: any) => r.status === "fulfilled").length;

    return NextResponse.json({
      success: true,
      message: `Processed ${pendingVideos.length} videos. ${successCount} successful.`,
    });
  } catch (error: any) {
    console.error("Queue Processing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

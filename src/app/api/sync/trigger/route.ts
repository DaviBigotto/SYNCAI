import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { SyncService } from "@/services/SyncService";

export async function POST(request: Request) {
  try {
    const session = await auth();

    // Podemos permitir que esta rota seja chamada pelo frontend (usuário logado)
    // ou por um CRON job via um token secret.
    const authHeader = request.headers.get("authorization");
    const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!session && !isCron) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let targetUserId = session?.user?.id;

    // Se a requisição veio do frontend, o body pode estar vazio.
    // Se for um cron, podemos iterar sobre usuários ou esperar um ID específico.
    if (request.body) {
      try {
        const body = await request.json();
        if (body.userId && isCron) {
          targetUserId = body.userId;
        }
      } catch (e) {
        // Body was empty or invalid JSON
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const syncService = new SyncService();
    const result = await syncService.discoverNewVideos(targetUserId);

    return NextResponse.json({
      success: true,
      message: `Sync triggered successfully. ${result.newVideosCount} new videos found.`,
      data: result,
    });
  } catch (error: any) {
    console.error("Sync Trigger Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

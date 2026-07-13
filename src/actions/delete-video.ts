"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function deleteVideoAction(videoId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const userId = session.user.id;

  const video = await prisma.video.findUnique({
    where: { id: videoId }
  });

  if (!video || video.userId !== userId) {
    throw new Error("Vídeo não encontrado ou não pertence a você");
  }

  await prisma.video.delete({
    where: { id: videoId }
  });

  revalidatePath("/dashboard/videos");
  return { success: true };
}

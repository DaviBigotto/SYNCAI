"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getSettings() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const settings = await prisma.settings.findUnique({
    where: { userId: session.user.id },
  })

  return settings
}

export async function updateTiktokUsername(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const username = formData.get("tiktokUsername") as string

  if (!username) {
    throw new Error("O nome de usuário não pode estar vazio")
  }

  // Remove o @ se o usuário digitar
  const cleanUsername = username.replace("@", "")

  await prisma.settings.upsert({
    where: { userId: session.user.id },
    update: { tiktokUsername: cleanUsername },
    create: { 
      userId: session.user.id,
      tiktokUsername: cleanUsername 
    },
  })

  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function updateInstagramUsername(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const username = formData.get("instagramUsername") as string

  if (!username) {
    throw new Error("O nome de usuário não pode estar vazio")
  }

  const cleanUsername = username.replace("@", "")

  await prisma.settings.upsert({
    where: { userId: session.user.id },
    update: { instagramUsername: cleanUsername },
    create: { 
      userId: session.user.id,
      instagramUsername: cleanUsername 
    },
  })

  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function updateInstagramCredentials(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const accountId = formData.get("accountId") as string
  const accessToken = formData.get("accessToken") as string

  if (!accountId || !accessToken) {
    throw new Error("Os campos não podem estar vazios")
  }

  const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 dias

  await prisma.settings.upsert({
    where: { userId: session.user.id },
    update: { 
      instagramAccountId: accountId,
      instagramAccessToken: accessToken,
      instagramTokenExpiresAt: expiresAt
    },
    create: { 
      userId: session.user.id,
      instagramAccountId: accountId,
      instagramAccessToken: accessToken,
      instagramTokenExpiresAt: expiresAt
    },
  })

  revalidatePath("/dashboard/settings")
  return { success: true }
}

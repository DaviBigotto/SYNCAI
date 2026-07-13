import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.video.deleteMany({
      where: {
        OR: [
          { description: { contains: 'Next.js 15' } },
          { description: { contains: 'Neon #postgres' } },
          { description: { contains: 'Teste de vídeo sincronizado' } }
        ]
      }
    });
    return NextResponse.json({ success: true, count: result.count });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

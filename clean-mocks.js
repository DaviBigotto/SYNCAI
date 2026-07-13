const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.video.deleteMany({
    where: {
      OR: [
        { description: { contains: 'Next.js 15' } },
        { description: { contains: 'Neon #postgres' } },
        { description: { contains: 'Teste de vídeo sincronizado' } }
      ]
    }
  });
  console.log(`Deleted ${result.count} fake videos.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const log = await prisma.syncLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1
  });
  console.log(log);
}

main().catch(console.error).finally(() => prisma.$disconnect());

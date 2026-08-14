import { config } from 'dotenv';
config();
import prisma from './src/backend/prisma';

async function run() {
  console.log('Backfilling User userid...');
  const users = await prisma.user.findMany({ orderBy: { userIndex: 'asc' } });
  let nextUserIndex = 1;
  for (const user of users) {
    const idx = user.userIndex || nextUserIndex++;
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        userid: (1000 + idx) + 'ae',
        userIndex: idx
      }
    });
  }
  
  console.log('Backfilling Profile displayId...');
  const profiles = await prisma.profile.findMany({ include: { user: true } });
  for (const profile of profiles) {
    if (!profile.displayId) {
      let dId = 'AE' + (1000 + (profile.user?.userIndex || 0));
      // Try to update, but if duplicate, append a random char
      try {
        await prisma.profile.update({
          where: { id: profile.id },
          data: { displayId: dId }
        });
      } catch (e) {
        await prisma.profile.update({
          where: { id: profile.id },
          data: { displayId: dId + Math.floor(Math.random() * 1000) }
        });
      }
    }
  }
  
  console.log('Done');
}

run().catch(console.error).finally(() => prisma.$disconnect());

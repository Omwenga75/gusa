import prisma from '@/lib/prisma';
import PoliticsClient from './PoliticsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PoliticsPage() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: 'nominations_open' }
  });
  const nominationsOpen = setting ? setting.value === 'true' : true;

  return <PoliticsClient nominationsOpenInitial={nominationsOpen} />;
}

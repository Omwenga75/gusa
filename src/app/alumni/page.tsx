import prisma from '@/lib/prisma';
import AlumniClient, { AlumniItem } from './AlumniClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Alumni | Gusii University Students Association (GUSA)',
  description: 'Honoring our esteemed alumni community, their professional milestones, and lasting impact.',
};

export default async function AlumniPage() {
  let initialAlumni: AlumniItem[] = [];

  try {
    const record = await prisma.siteSetting.findUnique({
      where: { key: 'gusa_alumni' },
    });
    if (record && record.value) {
      const parsed = JSON.parse(record.value);
      if (Array.isArray(parsed)) {
        initialAlumni = parsed;
      }
    }
  } catch (err) {
    console.error('Failed to prefetch alumni on server:', err);
  }

  return <AlumniClient initialAlumni={initialAlumni} />;
}

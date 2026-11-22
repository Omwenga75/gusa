import AlumniClient from './AlumniClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Alumni | Gusii University Students Association (GUSA)',
  description: 'Honoring our esteemed alumni community, their professional milestones, and lasting impact.',
};

export default function AlumniPage() {
  return <AlumniClient />;
}

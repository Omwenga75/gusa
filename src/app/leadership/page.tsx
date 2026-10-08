import prisma from '@/lib/prisma'
import LeadershipClient, { LeaderProfile } from './LeadershipClient'
import { compareLeaderHierarchy } from '@/lib/hierarchy'

export const dynamic = 'force-dynamic'

export default async function LeadershipPage() {
  let initialLeaders: LeaderProfile[] = []

  try {
    const rawLeaders = await prisma.leader.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        position: true,
        term: true,
        image: true,
        phone: true,
      },
    })

    initialLeaders = rawLeaders.map((ldr) => ({
      id: ldr.id,
      name: ldr.name,
      position: ldr.position,
      term: ldr.term,
      image: ldr.image,
      avatarInitials: ldr.name
        ? ldr.name.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
        : 'L',
      phone: ldr.phone || '',
    }))

    initialLeaders.sort(compareLeaderHierarchy)
  } catch (err) {
    console.error('Failed to prefetch leadership in server component:', err)
  }

  return <LeadershipClient initialLeaders={initialLeaders} />
}

import prisma from '@/lib/prisma'
import EmeritusClient, { EmeritusLeader } from './EmeritusClient'
import { compareLeaderHierarchy } from '@/lib/hierarchy'

export const dynamic = 'force-dynamic'

export default async function EmeritusPage() {
  let initialLeaders: EmeritusLeader[] = []

  try {
    const record = await prisma.siteSetting.findUnique({
      where: { key: 'emeritus_leaders' }
    })
    if (record && record.value) {
      const parsed = JSON.parse(record.value)
      if (Array.isArray(parsed)) {
        initialLeaders = parsed
        initialLeaders.sort(compareLeaderHierarchy)
      }
    }
  } catch (err) {
    console.error('Failed to prefetch emeritus leaders on server:', err)
  }

  return <EmeritusClient initialLeaders={initialLeaders} />
}

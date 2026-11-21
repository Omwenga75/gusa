import prisma from '@/lib/prisma'
import EldersClient, { ElderProfile } from './EldersClient'

export const dynamic = 'force-dynamic'

export default async function EldersPage() {
  let initialElders: ElderProfile[] = []

  try {
    const record = await prisma.siteSetting.findUnique({
      where: { key: 'gusa_elders' },
    })
    if (record?.value) {
      const parsed = JSON.parse(record.value)
      if (Array.isArray(parsed)) {
        initialElders = parsed.map((e: any) => ({
          id: e.id,
          name: e.name,
          image: e.image || null,
          avatarInitials:
            e.avatarInitials ||
            (e.name
              ? e.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'E'),
        }))
      }
    }
  } catch (err) {
    console.error('Failed to prefetch elders:', err)
  }

  return <EldersClient initialElders={initialElders} />
}

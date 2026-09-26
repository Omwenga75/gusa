export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function getInitials(name: string): string {
  if (!name) return ''
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
}

export function isAdmin(role: string): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN'
}

export function isSuperAdmin(role: string): boolean {
  return role === 'SUPER_ADMIN'
}

export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'APPROVED':
    case 'SUCCESS':
      return 'bg-green-100 text-green-800'
    case 'PENDING':
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800'
    case 'INACTIVE':
    case 'REJECTED':
    case 'FAILED':
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const seconds = Math.round((now.getTime() - d.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`
  
  const months = Math.round(days / 30)
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`
  
  const years = Math.round(months / 12)
  return `${years} year${years !== 1 ? 's' : ''} ago`
}

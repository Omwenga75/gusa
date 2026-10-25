'use client'

import React, { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

const getTargetDateTime = (dateStr: string, timeStr?: string): Date | null => {
  const dateObj = new Date(dateStr)
  if (isNaN(dateObj.getTime())) return null

  if (timeStr) {
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10)
      const minutes = parseInt(timeMatch[2], 10)
      const ampm = timeMatch[3].toUpperCase()
      if (ampm === 'PM' && hours < 12) hours += 12
      if (ampm === 'AM' && hours === 12) hours = 0
      dateObj.setHours(hours, minutes, 0, 0)
    }
  }
  return dateObj
}

export function EventCountdown({ dateStr, timeStr }: { dateStr: string; timeStr?: string }) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null)
  const [isPast, setIsPast] = useState<boolean>(false)

  useEffect(() => {
    const target = getTargetDateTime(dateStr, timeStr)
    if (!target) return

    const updateTimer = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setIsPast(true)
        setTimeLeft(null)
      } else {
        setIsPast(false)
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setTimeLeft(`${days}D: ${hours}H: ${minutes}M: ${seconds}S`)
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [dateStr, timeStr])

  if (isPast) {
    return (
      <span className="text-[9px] sm:text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 px-1.5 sm:px-2 py-0.5 rounded-md border border-emerald-500/30 whitespace-nowrap shrink-0">
        Passed
      </span>
    )
  }

  if (!timeLeft) return null

  return (
    <span className="text-[11px] sm:text-xs font-mono font-extrabold bg-violet-500/15 text-violet-300 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-violet-500/35 inline-flex items-center gap-1 whitespace-nowrap shadow-sm shrink-0">
      <Clock size={11} className="text-violet-400 shrink-0" />
      {timeLeft}
    </span>
  )
}

export default EventCountdown

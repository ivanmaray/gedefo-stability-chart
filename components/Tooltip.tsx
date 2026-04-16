'use client'

import { useState, useRef } from 'react'

export default function Tooltip({
  children,
  content,
  wide = false,
}: {
  children: React.ReactNode
  content: React.ReactNode
  wide?: boolean
}) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function enter() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }

  function leave() {
    closeTimer.current = setTimeout(() => setOpen(false), 180)
  }

  return (
    <div className="relative inline-block">
      <div onMouseEnter={enter} onMouseLeave={leave}>
        {children}
      </div>
      {open && (
        <div
          onMouseEnter={enter}
          onMouseLeave={leave}
          className={`absolute z-50 left-0 top-full mt-1 ${wide ? 'w-96' : 'w-72'} bg-white border border-gray-200 rounded-lg shadow-xl p-3 text-xs text-gray-700`}
        >
          {content}
        </div>
      )}
    </div>
  )
}

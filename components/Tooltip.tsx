'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

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
  const [style, setStyle] = useState<React.CSSProperties>({})
  const triggerRef = useRef<HTMLSpanElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const overTrigger = useRef(false)
  const overPanel = useRef(false)
  const [mounted, setMounted] = useState(false)
  const tooltipW = wide ? 384 : 288

  useEffect(() => { setMounted(true) }, [])

  function computePos() {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const above = spaceBelow < 280
    setStyle({
      position: 'fixed',
      top: above ? rect.top : rect.bottom + 2,
      left: Math.max(4, Math.min(rect.left, window.innerWidth - tooltipW - 8)),
      width: tooltipW,
      zIndex: 9999,
      transform: above ? 'translateY(-100%)' : 'none',
    })
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => {
      if (!overTrigger.current && !overPanel.current) {
        setOpen(false)
      }
    }, 300)
  }

  function onTriggerEnter() {
    overTrigger.current = true
    if (closeTimer.current) clearTimeout(closeTimer.current)
    computePos()
    setOpen(true)
  }

  function onTriggerLeave() {
    overTrigger.current = false
    scheduleClose()
  }

  function onPanelEnter() {
    overPanel.current = true
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  function onPanelLeave() {
    overPanel.current = false
    scheduleClose()
  }

  useEffect(() => {
    const el = triggerRef.current
    if (!el || !mounted) return
    el.addEventListener('mouseenter', onTriggerEnter)
    el.addEventListener('mouseleave', onTriggerLeave)
    return () => {
      el.removeEventListener('mouseenter', onTriggerEnter)
      el.removeEventListener('mouseleave', onTriggerLeave)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  return (
    <span ref={triggerRef} onMouseEnter={onTriggerEnter} onMouseLeave={onTriggerLeave} style={{ display: 'inline-block' }}>
      {children}
      {mounted && open && createPortal(
        <div
          onMouseEnter={onPanelEnter}
          onMouseLeave={onPanelLeave}
          style={style}
          className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 text-xs text-gray-700"
        >
          {content}
        </div>,
        document.body
      )}
    </span>
  )
}

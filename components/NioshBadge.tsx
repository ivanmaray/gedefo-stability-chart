'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

export default function NioshBadge({
  clasificacion: cls,
  matriz,
  epiLabel,
  RefFooterContent,
}: {
  clasificacion: string
  matriz: {
    tipo_cabina?: string
    epi_requerido?: string[]
    requisitos_sala?: string
    gestion_residuos?: string
    referencia?: { titulo?: string; autores?: string; anio?: number; url?: string }
  }
  epiLabel: Record<string, { icon: string; label: string }>
  RefFooterContent?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const badgeCls = cls === 'tabla_1'
    ? 'bg-red-100 text-red-700'
    : 'bg-orange-100 text-orange-700'

  const toggle = useCallback(() => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const above = spaceBelow < 320
      setStyle({
        position: 'fixed',
        top: above ? rect.top : rect.bottom + 4,
        left: Math.max(4, Math.min(rect.left, window.innerWidth - 392)),
        width: 384,
        zIndex: 99999,
        transform: above ? 'translateY(-100%)' : 'none',
      })
    }
    setOpen(o => !o)
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        panelRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    // Close on Escape
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const ref = matriz.referencia

  return (
    <>
      <button
        ref={triggerRef}
        onClick={toggle}
        className={`mt-1 inline-block text-[10px] font-medium px-1.5 py-0.5 rounded cursor-pointer underline decoration-dotted ${badgeCls}`}
      >
        NIOSH {cls.replace('_', ' ')}
      </button>

      {mounted && open && createPortal(
        <div
          ref={panelRef}
          style={style}
          className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 text-xs text-gray-700"
        >
          <div className="space-y-2.5">
            {/* Cabina */}
            {matriz.tipo_cabina && (
              <div className="flex gap-2">
                <span className="text-base">🏭</span>
                <div>
                  <p className="font-semibold text-[11px] text-gray-500 uppercase tracking-wide">Cabina</p>
                  <p className="text-gray-700">{matriz.tipo_cabina}</p>
                </div>
              </div>
            )}
            {/* EPI */}
            {matriz.epi_requerido && matriz.epi_requerido.length > 0 && (
              <div>
                <p className="font-semibold text-[11px] text-gray-500 uppercase tracking-wide mb-1">EPI requerido</p>
                <div className="space-y-0.5">
                  {matriz.epi_requerido.map((e: string) => {
                    const ep = epiLabel[e] ?? { icon: '\u2022', label: e.replace(/_/g, ' ') }
                    return (
                      <div key={e} className="flex items-center gap-1.5 text-gray-700">
                        <span>{ep.icon}</span>
                        <span>{ep.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {/* Sala */}
            {matriz.requisitos_sala && (
              <div className="flex gap-2">
                <span className="text-base">🏥</span>
                <div>
                  <p className="font-semibold text-[11px] text-gray-500 uppercase tracking-wide">Sala</p>
                  <p className="text-gray-600 text-[11px]">{matriz.requisitos_sala}</p>
                </div>
              </div>
            )}
            {/* Residuos */}
            {matriz.gestion_residuos && (
              <div className="flex gap-2 border-t border-gray-100 pt-2">
                <span className="text-base">♻️</span>
                <div>
                  <p className="font-semibold text-[11px] text-gray-500 uppercase tracking-wide">Residuos</p>
                  <p className="text-gray-500 text-[11px]">{matriz.gestion_residuos}</p>
                </div>
              </div>
            )}
            {/* Referencia */}
            {ref && (
              <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400 space-y-0.5">
                <p className="font-medium text-gray-500">{ref.titulo}</p>
                {ref.autores && <p>{ref.autores}{ref.anio ? `, ${ref.anio}` : ''}</p>}
                {ref.url && (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer"
                    className="text-blue-500 hover:underline block">
                    Ver fuente ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

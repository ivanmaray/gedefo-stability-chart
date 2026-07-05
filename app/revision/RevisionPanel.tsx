'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { confirmarNovedad, incorporarTodas } from './actions'
import type { Database } from '@/lib/types'

type Novedad = Database['public']['Tables']['cima_novedad']['Row']

export default function RevisionPanel({ novedades }: { novedades: Novedad[] }) {
  const [revisor, setRevisor] = useState('')
  const [msg, setMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('gedefo_revisor')
    if (saved) setRevisor(saved)
  }, [])

  const [bulkMsg, setBulkMsg] = useState<{ text: string; ok: boolean } | null>(null)

  function actuar(id: string, decision: 'incorporar' | 'descartar') {
    if (!revisor.trim()) {
      setMsg({ id, text: 'Escribe tu nombre antes de confirmar.', ok: false })
      return
    }
    localStorage.setItem('gedefo_revisor', revisor.trim())
    setMsg(null)
    startTransition(async () => {
      const res = await confirmarNovedad({ id, decision, revisor })
      if (!res.ok) {
        setMsg({ id, text: res.error, ok: false })
      } else {
        const text =
          res.estado === 'rechazada'
            ? 'Descartada.'
            : res.paCreado
              ? 'Incorporada + principio activo nuevo creado.'
              : res.incorporada
                ? 'Incorporada a la base de datos.'
                : 'Incorporada (el envase ya existía).'
        setMsg({ id, text, ok: true })
        router.refresh()
      }
    })
  }

  function incorporarBloque() {
    if (!revisor.trim()) {
      setBulkMsg({ text: 'Escribe tu nombre antes de incorporar.', ok: false })
      return
    }
    if (!confirm(`¿Incorporar las ${novedades.length} novedades pendientes a la base de datos?`)) return
    localStorage.setItem('gedefo_revisor', revisor.trim())
    setBulkMsg(null)
    startTransition(async () => {
      const res = await incorporarTodas({ revisor })
      if (!res.ok) setBulkMsg({ text: res.error, ok: false })
      else {
        setBulkMsg({
          text: `Incorporadas ${res.incorporadas} · ${res.paCreados} principios activos nuevos · ${res.errores} errores`,
          ok: true,
        })
        router.refresh()
      }
    })
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="text-sm text-gray-600">Confirma:</label>
        <input
          value={revisor}
          onChange={(e) => setRevisor(e.target.value)}
          placeholder="Tu nombre y apellido"
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        <span className="text-xs text-gray-400">Se recuerda en este navegador. Queda registrado quién incorpora cada una.</span>
      </div>

      {novedades.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            onClick={incorporarBloque}
            disabled={pending}
            className="px-3 py-1.5 text-sm rounded-md border border-green-300 bg-green-100 text-green-800 hover:bg-green-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {pending ? 'Incorporando…' : `Incorporar todas (${novedades.length})`}
          </button>
          {bulkMsg && <span className={`text-[13px] ${bulkMsg.ok ? 'text-green-700' : 'text-red-600'}`}>{bulkMsg.text}</span>}
        </div>
      )}

      {novedades.length === 0 && (
        <p className="text-sm text-gray-400 italic">No hay novedades pendientes.</p>
      )}

      <div className="space-y-2">
        {novedades.map((n) => (
          <div key={n.id} className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-1.5 py-0.5 rounded border bg-gray-50 border-gray-200 text-gray-500">
                  {n.tipo === 'nuevo_principio_activo' ? 'PA nuevo' : 'Presentación nueva'}
                </span>
                <span className="font-medium text-gray-800 capitalize truncate">{n.dci ?? '—'}</span>
              </div>
              <div className="text-[13px] text-gray-500 truncate" title={n.nombre_comercial ?? ''}>
                {n.nombre_comercial ?? '—'}
              </div>
              <div className="text-[12px] text-gray-400 font-mono">
                CN {n.codigo_nacional} · {n.atc_code ?? '—'}
                {n.ficha_tecnica_url && (
                  <> · <a href={n.ficha_tecnica_url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">FT</a></>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => actuar(n.id, 'incorporar')}
                disabled={pending}
                className="px-3 py-1 text-[13px] rounded border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Incorporar
              </button>
              <button
                onClick={() => actuar(n.id, 'descartar')}
                disabled={pending}
                className="px-3 py-1 text-[13px] rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Descartar
              </button>
            </div>

            {msg?.id === n.id && (
              <div className={`text-[12px] w-full sm:w-auto ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

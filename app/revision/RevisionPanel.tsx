'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { confirmarNovedad, incorporarTodas, confirmarBaja, retirarTodasBajas } from './actions'
import type { Database } from '@/lib/types'

type Novedad = Database['public']['Tables']['cima_novedad']['Row']
export type BajaItem = {
  envaseId: string
  codigo_nacional: string | null
  motivo: string | null
  dci: string | null
  nombre_comercial: string | null
  atc_code: string | null
}

const motivoLabel: Record<string, string> = {
  retirada_cima: 'Retirada de CIMA',
  revocada: 'Revocada',
  no_comercializada: 'No comercializada',
}

export default function RevisionPanel({ novedades, bajas }: { novedades: Novedad[]; bajas: BajaItem[] }) {
  const [revisor, setRevisor] = useState('')
  const [msg, setMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('gedefo_revisor')
    if (saved) setRevisor(saved)
  }, [])

  const [bulkMsg, setBulkMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [bajaMsg, setBajaMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null)
  const [bajaBulkMsg, setBajaBulkMsg] = useState<{ text: string; ok: boolean } | null>(null)

  function retirarBloque() {
    if (!revisor.trim()) {
      setBajaBulkMsg({ text: 'Escribe tu nombre antes de retirar.', ok: false })
      return
    }
    if (!confirm(`¿Retirar las ${bajas.length} bajas? Se marcarán como no comercializadas (conserva histórico).`)) return
    localStorage.setItem('gedefo_revisor', revisor.trim())
    setBajaBulkMsg(null)
    startTransition(async () => {
      const res = await retirarTodasBajas({ revisor })
      if (!res.ok) setBajaBulkMsg({ text: res.error, ok: false })
      else {
        setBajaBulkMsg({ text: `Retiradas ${res.retiradas}.`, ok: true })
        router.refresh()
      }
    })
  }

  function retirar(envaseId: string, decision: 'retirar' | 'mantener') {
    if (!revisor.trim()) {
      setBajaMsg({ id: envaseId, text: 'Escribe tu nombre.', ok: false })
      return
    }
    localStorage.setItem('gedefo_revisor', revisor.trim())
    setBajaMsg(null)
    startTransition(async () => {
      const res = await confirmarBaja({ envaseId, decision, revisor })
      if (!res.ok) setBajaMsg({ id: envaseId, text: res.error, ok: false })
      else {
        setBajaMsg({ id: envaseId, text: res.estado === 'retirada' ? 'Retirada.' : 'Mantenida.', ok: true })
        router.refresh()
      }
    })
  }

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

      {bajas.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-red-700 mb-1">
            Bajas pendientes de retirar <span className="text-gray-400 font-normal">({bajas.length})</span>
          </h2>
          <p className="text-xs text-gray-400 mb-3">
            En la base de datos pero CIMA ya no las comercializa. <strong>Retirar</strong> las marca como no
            comercializadas (conserva el histórico). <strong>Mantener</strong> ignora el aviso.
          </p>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <button
              onClick={retirarBloque}
              disabled={pending}
              className="px-3 py-1.5 text-sm rounded-md border border-red-300 bg-red-100 text-red-800 hover:bg-red-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {pending ? 'Retirando…' : `Retirar todas (${bajas.length})`}
            </button>
            {bajaBulkMsg && <span className={`text-[13px] ${bajaBulkMsg.ok ? 'text-green-700' : 'text-red-600'}`}>{bajaBulkMsg.text}</span>}
          </div>
          <div className="space-y-2">
            {bajas.map((b) => (
              <div key={b.envaseId} className="border border-red-100 bg-red-50/40 rounded-lg p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-1.5 py-0.5 rounded border bg-red-100 border-red-200 text-red-700">
                      {b.motivo ? motivoLabel[b.motivo] ?? b.motivo : 'Baja'}
                    </span>
                    <span className="font-medium text-gray-800 capitalize truncate">{b.dci ?? '—'}</span>
                  </div>
                  <div className="text-[13px] text-gray-500 truncate" title={b.nombre_comercial ?? ''}>
                    {b.nombre_comercial ?? '—'}
                  </div>
                  <div className="text-[12px] text-gray-400 font-mono">CN {b.codigo_nacional} · {b.atc_code ?? '—'}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => retirar(b.envaseId, 'retirar')}
                    disabled={pending}
                    className="px-3 py-1 text-[13px] rounded border border-red-300 bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Retirar
                  </button>
                  <button
                    onClick={() => retirar(b.envaseId, 'mantener')}
                    disabled={pending}
                    className="px-3 py-1 text-[13px] rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Mantener
                  </button>
                </div>
                {bajaMsg?.id === b.envaseId && (
                  <div className={`text-[12px] w-full sm:w-auto ${bajaMsg.ok ? 'text-green-700' : 'text-red-600'}`}>
                    {bajaMsg.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

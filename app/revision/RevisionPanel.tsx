'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { votarNovedad } from './actions'
import type { Database } from '@/lib/types'

type Novedad = Database['public']['Tables']['cima_novedad']['Row']

function Voto({ nombre, decision }: { nombre: string | null; decision: string | null }) {
  if (!nombre) return <span className="text-gray-300">—</span>
  const cls = decision === 'incluir' ? 'text-green-700' : decision === 'descartar' ? 'text-red-600' : 'text-gray-500'
  return (
    <span className={cls} title={nombre}>
      {nombre.split(' ')[0]} · {decision === 'incluir' ? '✓ incluir' : '✗ descartar'}
    </span>
  )
}

export default function RevisionPanel({ novedades }: { novedades: Novedad[] }) {
  const [revisor, setRevisor] = useState('')
  const [msg, setMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('gedefo_revisor')
    if (saved) setRevisor(saved)
  }, [])

  function vote(id: string, decision: 'incluir' | 'descartar') {
    if (!revisor.trim()) {
      setMsg({ id, text: 'Escribe tu nombre antes de votar.', ok: false })
      return
    }
    localStorage.setItem('gedefo_revisor', revisor.trim())
    setMsg(null)
    startTransition(async () => {
      const res = await votarNovedad({ id, decision, revisor })
      if (!res.ok) {
        setMsg({ id, text: res.error, ok: false })
      } else {
        const text =
          res.estado === 'aceptada'
            ? res.promovida ? 'Aceptada e incorporada a la base de datos.' : 'Aceptada (el PA nuevo requiere alta manual de ficha).'
            : res.estado === 'rechazada' ? 'Rechazada.'
            : 'Voto registrado — falta el 2º revisor.'
        setMsg({ id, text, ok: true })
        router.refresh()
      }
    })
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <label className="text-sm text-gray-600">Revisor:</label>
        <input
          value={revisor}
          onChange={(e) => setRevisor(e.target.value)}
          placeholder="Tu nombre y apellido"
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        <span className="text-xs text-gray-400">Se recuerda en este navegador. Hacen falta 2 revisores distintos.</span>
      </div>

      {novedades.length === 0 && (
        <p className="text-sm text-gray-400 italic">No hay novedades pendientes de validar.</p>
      )}

      <div className="space-y-2">
        {novedades.map((n) => {
          const yaVoteRev1 = n.revisor_1 === revisor.trim() && !!revisor.trim()
          const slotsLlenos = !!n.revisor_1 && !!n.revisor_2
          const bloqueado = pending || slotsLlenos || yaVoteRev1
          return (
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

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-[12px] leading-tight text-right">
                  <div><Voto nombre={n.revisor_1} decision={n.revisor_1_decision} /></div>
                  <div><Voto nombre={n.revisor_2} decision={n.revisor_2_decision} /></div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => vote(n.id, 'incluir')}
                    disabled={bloqueado}
                    className="px-2.5 py-1 text-[13px] rounded border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Incluir
                  </button>
                  <button
                    onClick={() => vote(n.id, 'descartar')}
                    disabled={bloqueado}
                    className="px-2.5 py-1 text-[13px] rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Descartar
                  </button>
                </div>
              </div>

              {msg?.id === n.id && (
                <div className={`text-[12px] w-full sm:w-auto ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>
                  {msg.text}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

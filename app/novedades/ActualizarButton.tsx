'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function ActualizarButton() {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const router = useRouter()

  function run() {
    setErr(null)
    setMsg(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/actualizar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
        const data = await res.json()
        if (!res.ok || !data.ok) {
          setErr(data.error ?? 'Error al actualizar')
          return
        }
        setMsg(
          `Suministro: +${data.suministro_marcados} con problema, −${data.suministro_resueltos} resueltos · ` +
          `bajas nuevas: ${data.bajas_nuevas} (revisados ${data.envases_revisados_bajas})`,
        )
        router.refresh()
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Error de red')
      }
    })
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <button
        onClick={run}
        disabled={pending}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 disabled:opacity-60 disabled:cursor-not-allowed w-fit"
      >
        {pending && (
          <span className="inline-block w-3.5 h-3.5 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
        )}
        {pending ? 'Actualizando…' : 'Actualizar existentes (suministro + bajas)'}
      </button>
      {msg && <span className="text-[13px] text-green-700">{msg}</span>}
      {err && <span className="text-[13px] text-red-600">Error: {err}</span>}
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function BarridoButton() {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const router = useRouter()

  function run() {
    setErr(null)
    setMsg(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/barrido', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ atc: 'L01' }),
        })
        const data = await res.json()
        if (!res.ok || !data.ok) {
          setErr(data.error ?? 'Error en el barrido')
          return
        }
        setMsg(
          `Procesados ${data.detalle_procesados} medicamentos · ${data.novedades_nuevas} novedades nuevas ` +
          `(${data.nuevas_presentaciones} presentaciones, ${data.nuevos_principios_activos} PA nuevos) · ` +
          `quedan ${data.quedan_por_procesar} por procesar`,
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
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 disabled:opacity-60 disabled:cursor-not-allowed w-fit"
      >
        {pending && (
          <span className="inline-block w-3.5 h-3.5 border-2 border-sky-300 border-t-sky-600 rounded-full animate-spin" />
        )}
        {pending ? 'Barriendo CIMA…' : 'Ejecutar barrido (L01)'}
      </button>
      {msg && <span className="text-[13px] text-green-700">{msg}</span>}
      {err && <span className="text-[13px] text-red-600">Error: {err}</span>}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ActualizarButton() {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const router = useRouter()

  async function run() {
    setErr(null)
    setMsg(null)
    setProgress('Sincronizando suministro…')
    setRunning(true)
    const desde = new Date().toISOString()
    let suministro = true
    let sm = 0, sr = 0, bajas = 0, revisados = 0
    try {
      for (let i = 0; i < 25; i++) {
        const res = await fetch('/api/actualizar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ desde, suministro, max_bajas: 80 }),
        })
        const d = await res.json()
        if (!res.ok || !d.ok) {
          setErr(d.error ?? 'Error al actualizar')
          break
        }
        if (suministro) {
          sm = d.suministro_marcados
          sr = d.suministro_resueltos
        }
        suministro = false
        bajas += d.bajas_nuevas
        revisados += d.revisados_lote
        if (d.bajas_pendientes > 0 && d.revisados_lote > 0) {
          setProgress(`Revisando bajas… ${revisados}/${revisados + d.bajas_pendientes}`)
        } else {
          setProgress(null)
          setMsg(`Listo. Suministro: +${sm} con problema, −${sr} resueltos · bajas nuevas: ${bajas} · ${revisados} revisados`)
          break
        }
      }
      router.refresh()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Error de red')
    } finally {
      setRunning(false)
      setProgress(null)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <button
        onClick={run}
        disabled={running}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 disabled:opacity-60 disabled:cursor-not-allowed w-fit"
      >
        {running && (
          <span className="inline-block w-3.5 h-3.5 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
        )}
        {running ? 'Actualizando…' : 'Actualizar existentes (suministro + bajas)'}
      </button>
      {progress && <span className="text-[13px] text-amber-700">{progress}</span>}
      {msg && <span className="text-[13px] text-green-700">{msg}</span>}
      {err && <span className="text-[13px] text-red-600">Error: {err}</span>}
    </div>
  )
}

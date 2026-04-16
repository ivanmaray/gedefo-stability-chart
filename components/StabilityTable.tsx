import type { Database } from '@/lib/types'

type Estabilidad = Database['public']['Tables']['estabilidad']['Row']

export default function StabilityTable({ estabilidades }: { estabilidades: Estabilidad[] }) {
  if (estabilidades.length === 0) {
    return <p className="text-xs text-gray-400">Sin datos de estabilidad registrados.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-500 uppercase tracking-wide text-[10px]">
            <th className="text-left px-3 py-2 font-medium border-b border-gray-200">Diluyente</th>
            <th className="text-left px-3 py-2 font-medium border-b border-gray-200">Conc. (mg/mL)</th>
            <th className="text-left px-3 py-2 font-medium border-b border-gray-200">Envase</th>
            <th className="text-left px-3 py-2 font-medium border-b border-gray-200">Temp. (°C)</th>
            <th className="text-left px-3 py-2 font-medium border-b border-gray-200">Luz</th>
            <th className="text-left px-3 py-2 font-medium border-b border-gray-200">Tiempo</th>
            <th className="text-left px-3 py-2 font-medium border-b border-gray-200">Notas</th>
          </tr>
        </thead>
        <tbody>
          {estabilidades.map((e) => (
            <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2 text-gray-700">{e.diluyente ?? '—'}</td>
              <td className="px-3 py-2 text-gray-700">{e.concentracion_mg_ml ?? '—'}</td>
              <td className="px-3 py-2 text-gray-700">{e.envase ?? '—'}</td>
              <td className="px-3 py-2 text-gray-700">{e.temperatura_celsius != null ? `${e.temperatura_celsius}°C` : '—'}</td>
              <td className="px-3 py-2">
                {e.proteccion_luz == null ? '—' : e.proteccion_luz ? (
                  <span className="text-amber-600 font-medium">Proteger</span>
                ) : (
                  <span className="text-gray-400">No req.</span>
                )}
              </td>
              <td className="px-3 py-2 font-semibold text-blue-700">
                {formatHoras(e.tiempo_horas)}
              </td>
              <td className="px-3 py-2 text-gray-500 max-w-xs truncate" title={e.notas_cualitativas ?? undefined}>
                {e.notas_cualitativas ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatHoras(h: number): string {
  if (h < 24) return `${h}h`
  const dias = h / 24
  return Number.isInteger(dias) ? `${dias}d` : `${h}h`
}

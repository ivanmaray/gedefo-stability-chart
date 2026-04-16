import Link from 'next/link'
import type { Database } from '@/lib/types'

type PrincipioActivo = Database['public']['Tables']['principio_activo']['Row']

const nioshBadge: Record<string, string> = {
  grupo_1: 'bg-red-100 text-red-700 border-red-200',
  grupo_2: 'bg-orange-100 text-orange-700 border-orange-200',
  grupo_3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
}

export default function DrugList({ drugs }: { drugs: PrincipioActivo[] }) {
  if (drugs.length === 0) {
    return <p className="text-gray-500 text-sm">No hay principios activos registrados.</p>
  }

  return (
    <ul className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-200 shadow-sm">
      {drugs.map((drug) => (
        <li key={drug.id}>
          <Link
            href={`/farmaco/${drug.id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-gray-900 group-hover:text-blue-700 capitalize">
                {drug.dci}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {drug.atc_code && (
                  <span className="text-xs text-gray-400 font-mono">{drug.atc_code}</span>
                )}
                {drug.familia_farmacologica && (
                  <span className="text-xs text-gray-500">{drug.familia_farmacologica}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {drug.clasificacion_niosh && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${nioshBadge[drug.clasificacion_niosh] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  NIOSH {drug.clasificacion_niosh.replace('_', ' ')}
                </span>
              )}
              <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

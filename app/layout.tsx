import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GEDEFO Stability Chart',
  description: 'Base de datos de estabilidad de medicamentos oncohematológicos para farmacia hospitalaria española',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
            {/* Logo + título */}
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity shrink-0">
              <img src="/logo-gedefo.jpg" alt="GEDEFO" className="h-8 w-auto" />
              <div className="hidden sm:flex flex-col leading-tight border-l border-gray-200 pl-3">
                <span className="text-[13px] font-semibold text-gray-700 tracking-tight">Stability Chart</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Grupo Español para el Desarrollo de la Farmacia Oncológica</span>
              </div>
            </a>

            {/* Nav */}
            <nav className="hidden sm:flex items-center gap-4">
              <a href="/" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-medium">Stability Chart</a>
              <a href="/proyecto" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-medium">Proyecto</a>
            </nav>

            {/* Aviso */}
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 shrink-0">
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Uso exclusivo para profesionales sanitarios
            </span>
          </div>
        </header>

        <main className="max-w-screen-2xl mx-auto px-6 py-6">
          {children}
        </main>

        <footer className="border-t border-gray-100 mt-16">
          <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between text-[11px] text-gray-400">
            <span>GEDEFO · Grupo Español para el Desarrollo de la Farmacia Oncológica</span>
            <span>Verificar siempre con ficha técnica vigente · {new Date().getFullYear()}</span>
          </div>
        </footer>
      </body>
    </html>
  )
}

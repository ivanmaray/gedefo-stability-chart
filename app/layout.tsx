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
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-2xl font-bold text-blue-700 tracking-tight">GEDEFO</span>
              <span className="text-sm text-gray-500 font-medium hidden sm:block">Stability Chart · Farmacia Hospitalaria</span>
            </a>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-gray-400 text-center">
            Uso exclusivo para profesionales sanitarios. Verificar siempre con ficha técnica vigente.
          </div>
        </footer>
      </body>
    </html>
  )
}

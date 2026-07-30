import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import BarraSesion from '@/components/BarraSesion'
import { RUTAS } from '@/lib/rutas'

export default function Encabezado({ usuario }) {
  return (
    <header className="shrink-0 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-2 lg:px-6">
        <Link to={RUTAS.inicio} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600">
          <Search size={15} />
          Nueva consulta
        </Link>
        <BarraSesion usuario={usuario} />
      </div>
    </header>
  )
}
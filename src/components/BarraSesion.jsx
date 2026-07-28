import { LogOut, UserRound } from 'lucide-react'
import { nombreInstitucion } from '@/lib/constantes'
import { ROL_LABEL } from '@/lib/sesion'

export default function BarraSesion({ usuario }) {
  if (!usuario?.rol) return null

  const nombre = usuario.nombre || ROL_LABEL[usuario.rol]
  const detalle = usuario.institucionId
    ? nombreInstitucion(usuario.institucionId)
    : usuario.nombre
      ? ROL_LABEL[usuario.rol]
      : null

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 p-1.5 shadow-sm backdrop-blur">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
        <UserRound size={17} className="text-blue-600" />
      </span>
      <div className="pl-1 pr-2 leading-tight">
        <p className="text-sm font-medium text-slate-800">{nombre}</p>
        {detalle && <p className="text-xs text-slate-500">{detalle}</p>}
      </div>
      <span className="h-6 w-px bg-slate-200" />
      <button type="button" title="Cerrar sesión" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">
        <LogOut size={16} />
      </button>
    </div>
  )
}
import { useEffect, useRef, useState } from 'react'
import { LogOut, UserRound } from 'lucide-react'
import { nombreDepartamento } from '@/lib/constantes'
import { ROL_LABEL } from '@/lib/sesion'

export default function BarraSesion({ usuario }) {
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)

  useEffect(() => {
    if (!abierto) return
    const fuera = (e) => {
      if (!contenedor.current?.contains(e.target)) setAbierto(false)
    }
    document.addEventListener('mousedown', fuera)
    return () => document.removeEventListener('mousedown', fuera)
  }, [abierto])

  if (!usuario?.rol) return null

  const nombre = usuario.nombre || ROL_LABEL[usuario.rol]
  const detalle = usuario.departamentoId
    ? nombreDepartamento(usuario.departamentoId)
    : usuario.nombre
      ? ROL_LABEL[usuario.rol]
      : null

  return (
    <div ref={contenedor} className="relative">
      <button type="button" onClick={() => setAbierto((v) => !v)} title="Opciones de sesión" className="flex cursor-pointer items-start gap-2 rounded-full px-2.5 py-1.5 transition-colors hover:bg-slate-100">
        <UserRound size={20} className="shrink-0 text-blue-600" />
        <span className="pr-0.5 text-left leading-tight">
          <span className="block text-sm font-medium text-slate-700">{nombre}</span>
          {detalle && <span className="block text-xs text-slate-500">{detalle}</span>}
        </span>
      </button>

      {abierto && (
        <div className="absolute right-0 z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          <button type="button" onMouseDown={(e) => e.stopPropagation()} className="flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-red-50 hover:text-red-600">
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
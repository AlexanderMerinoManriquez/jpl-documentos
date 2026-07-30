import { useRef, useState } from 'react'
import { FilePlus2, FolderPlus, LogOut, UserRound } from 'lucide-react'
import { codigoDepartamento } from '@/lib/constantes'
import { ROL_LABEL } from '@/lib/sesion'
import { useClickAfuera } from '@/hooks/ui'

export default function BarraSesion({ usuario }) {
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)

  useClickAfuera(contenedor, abierto, () => setAbierto(false))

  if (!usuario?.rol) return null

  const nombre = usuario.nombre || ROL_LABEL[usuario.rol]
  const codigo = usuario.departamentoId ? codigoDepartamento(usuario.departamentoId) : null

  return (
    <div ref={contenedor} className="relative">
      <button type="button" onClick={() => setAbierto((v) => !v)} title="Opciones de sesión" className="flex cursor-pointer items-center gap-2 rounded-full px-2.5 py-1.5 transition-colors hover:bg-slate-100">
        <UserRound size={20} className="shrink-0 text-blue-600" />
        <span className="text-sm leading-tight text-slate-700">
          {codigo && <span className="font-semibold text-blue-600">{codigo}</span>}
          {codigo && <span className="mx-1.5 text-slate-300">•</span>}
          <span className="font-medium">{nombre}</span>
        </span>
      </button>

      {abierto && (
        <div className="absolute right-0 z-20 mt-1.5 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">{nombre}</p>
            <p className="text-xs text-slate-500">{ROL_LABEL[usuario.rol]}{codigo && ` · ${codigo}`}</p>
          </div>

          {(usuario.causasCreadas != null || usuario.documentosSubidos != null) && (
            <div className="grid grid-cols-2 gap-2 px-3 py-3">
              <Estadistica icono={FolderPlus} valor={usuario.causasCreadas ?? 0} etiqueta="Causas" />
              <Estadistica icono={FilePlus2} valor={usuario.documentosSubidos ?? 0} etiqueta="Documentos" />
            </div>
          )}

          <div className="border-t border-slate-100 py-1">
            <button type="button" onMouseDown={(e) => e.stopPropagation()} className="flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-red-50 hover:text-red-600">
              <LogOut size={15} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Estadistica({ icono: Icono, valor, etiqueta }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <div className="flex items-center gap-1.5 text-blue-600">
        <Icono size={14} />
        <span className="text-lg font-semibold tabular-nums text-slate-800">{valor}</span>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">{etiqueta}</p>
    </div>
  )
}
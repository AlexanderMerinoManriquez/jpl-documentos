import { formatearFecha } from '@/lib/expedientes'

export default function HistorialVersiones({ versiones = [], seleccionada, onSeleccionar }) {
  if (versiones.length === 0) {
    return <p className="p-4 text-sm text-slate-400">Sin versiones registradas.</p>
  }

  const ordenadas = [...versiones].sort((a, b) => b.numero - a.numero)

  return (
    <ol className="space-y-2 p-4">
      {ordenadas.map((v) => {
        const esSeleccionada = v.id === seleccionada?.id
        const clase = esSeleccionada
          ? 'w-full rounded-lg border border-blue-400 bg-blue-50 p-3 text-left transition-colors'
          : 'w-full rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50'

        return (
          <li key={v.id}>
            <button onClick={() => onSeleccionar(v)} className={clase}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-800">Versión {v.numero}</span>
                {v.activa && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Vigente</span>}
              </div>
              <p className="mt-1 text-xs text-slate-600">{v.motivo}</p>
              <p className="mt-1 text-xs text-slate-400">{formatearFecha(v.subidoEn, true)}</p>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
import { FileText } from 'lucide-react'
import { formatearFecha } from '@/lib/expedientes'

export default function ListaDocumentos({ documentos = [], seleccionado, onSeleccionar }) {
  if (documentos.length === 0) {
    return <p className="p-4 text-sm text-slate-400">Este expediente aún no tiene documentos.</p>
  }

  return (
    <ol className="space-y-1.5 p-3">
      {documentos.map((doc) => {
        const activo = doc.id === seleccionado?.id
        const clase = activo
          ? 'flex w-full cursor-pointer gap-2.5 rounded-lg border border-blue-400 bg-blue-50 p-3 text-left transition-colors'
          : 'flex w-full cursor-pointer gap-2.5 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50'

        return (
          <li key={doc.id}>
            <button type="button" onClick={() => onSeleccionar(doc)} className={clase}>
              <FileText size={18} className={`mt-0.5 shrink-0 ${activo ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-sm font-medium ${activo ? 'text-blue-700' : 'text-slate-800'}`}>{doc.nombre}</span>
                <span className="mt-0.5 block text-xs text-slate-400">{formatearFecha(doc.creadoEn)}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
import { Download, FileWarning } from 'lucide-react'
import { formatearTamano } from '@/lib/documentos'

export default function VisorArchivo({ version }) {
  if (!version) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-16 text-center">
        <FileWarning size={32} className="text-slate-300" />
        <p className="text-sm text-slate-500">Este documento no tiene archivo asociado.</p>
      </div>
    )
  }

  const claseBoton = 'inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50'

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-800">{version.nombre}</p>
          <p className="text-xs text-slate-500">{formatearTamano(version.tamano)}</p>
        </div>
        <a href={version.url} download={version.nombre} className={claseBoton}>
          <Download size={16} />
          Descargar
        </a>
      </div>

      <div className="flex min-h-[70vh] items-center justify-center bg-slate-100">
        {version.url && <iframe src={version.url} title={version.nombre} className="h-[70vh] w-full border-0" />}
        {!version.url && <p className="text-sm text-slate-400">Vista previa no disponible.</p>}
      </div>
    </div>
  )
}
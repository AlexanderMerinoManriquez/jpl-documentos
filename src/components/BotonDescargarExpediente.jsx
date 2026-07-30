import { FileDown } from 'lucide-react'
import { useUnificarPdf } from '@/hooks/expedientes'

export default function BotonDescargarExpediente({ expediente, className = '' }) {
  const { unificar, generando, progreso } = useUnificarPdf()

  if (!expediente?.documentos?.length) return null

  const texto = generando
    ? progreso ? `Uniendo ${progreso.actual}/${progreso.total}…` : 'Generando…'
    : 'Descargar causa completa'

  return (
    <button
      type="button"
      onClick={() => unificar(expediente)}
      disabled={generando}
      title="Descargar todos los documentos de la causa unidos en un solo PDF"
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {generando
        ? <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
        : <FileDown size={16} className="shrink-0" />}
      {texto}
    </button>
  )
}
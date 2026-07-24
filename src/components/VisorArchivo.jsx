import { useEffect, useState } from 'react'
import { Download, ExternalLink, FileWarning, Maximize2, X } from 'lucide-react'
import { formatearTamano } from '@/lib/expedientes'

const BOTON = 'inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50'
const PARAMETROS_VISOR = '#zoom=page-width&pagemode=none&toolbar=1'

export default function VisorArchivo({ version }) {
  const [expandido, setExpandido] = useState(false)

  useEffect(() => {
    if (!expandido) return
    const escuchar = (e) => e.key === 'Escape' && setExpandido(false)
    window.addEventListener('keydown', escuchar)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', escuchar)
      document.body.style.overflow = ''
    }
  }, [expandido])

  if (!version) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-16 text-center">
        <FileWarning size={32} className="text-slate-300" />
        <p className="text-sm text-slate-500">Este documento no tiene archivo asociado.</p>
      </div>
    )
  }

  const contenido = version.url
    ? <iframe src={`${version.url}${PARAMETROS_VISOR}`} title={version.nombre} className="h-full w-full border-0" />
    : <div className="flex h-full items-center justify-center"><p className="text-sm text-slate-400">Vista previa no disponible.</p></div>

  if (expandido) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-900">
        <div className="flex items-center justify-between gap-4 border-b border-slate-700 px-4 py-2.5">
          <p className="truncate text-sm font-medium text-white">{version.nombre}</p>
          <div className="flex shrink-0 items-center gap-2">
            <a href={version.url} download={version.nombre} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:bg-slate-800">
              <Download size={16} />
              Descargar
            </a>
            <button type="button" onClick={() => setExpandido(false)} title="Cerrar" className="cursor-pointer rounded-lg p-2 text-slate-300 transition-colors hover:bg-slate-800">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-slate-800">{contenido}</div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-800">{version.nombre}</p>
          <p className="text-xs text-slate-500">{formatearTamano(version.tamano)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => setExpandido(true)} title="Pantalla completa" className={BOTON}>
            <Maximize2 size={16} />
            <span className="hidden sm:inline">Ampliar</span>
          </button>
          <a href={version.url} target="_blank" rel="noopener noreferrer" title="Abrir en pestaña nueva" className={`${BOTON} px-2`}>
            <ExternalLink size={16} />
          </a>
          <a href={version.url} download={version.nombre} title="Descargar" className={BOTON}>
            <Download size={16} />
            <span className="hidden sm:inline">Descargar</span>
          </a>
        </div>
      </div>

      <div className="h-[50vh] bg-slate-100 lg:h-[70vh]">{contenido}</div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { Download, ExternalLink, FileText, FileWarning, History, Maximize2, X } from 'lucide-react'
import { formatearTamano } from '@/lib/expedientes'

const PARAMETROS_VISOR = '#zoom=page-width&pagemode=none&toolbar=1'
const BOTON = 'inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-blue-600 hover:shadow-sm'

export default function VisorArchivo({ version, esHistorica = false, onVerVigente, alto = 'h-[50vh] lg:h-[70vh]' }) {
  const [expandido, setExpandido] = useState(false)
  const [cargadoId, setCargadoId] = useState(null)

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
      <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-center shadow-md ${alto}`}>
        <FileWarning size={32} className="text-slate-300" />
        <p className="text-sm text-slate-500">Este documento no tiene archivo asociado.</p>
      </div>
    )
  }

  const cargando = cargadoId !== version.id

  const contenido = version.url ? (
    <>
      {cargando && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-100">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-400">Cargando documento…</p>
        </div>
      )}
      <iframe key={version.id} src={`${version.url}${PARAMETROS_VISOR}`} title={version.nombre} onLoad={() => setCargadoId(version.id)} className="h-full w-full border-0" />
    </>
  ) : (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-slate-400">Vista previa no disponible.</p>
    </div>
  )

  const avisoHistorica = esHistorica && (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
      <span className="flex items-center gap-2">
        <History size={15} className="shrink-0" />
        Versión {version.numero} · no es la vigente
      </span>
      {onVerVigente && (
        <button type="button" onClick={onVerVigente} className="shrink-0 cursor-pointer font-medium underline hover:text-amber-900">
          Ver vigente
        </button>
      )}
    </div>
  )

  if (expandido) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-900">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-700 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800">
              <FileText size={18} className="text-slate-300" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{version.nombre}</p>
              <p className="text-xs text-slate-400">{formatearTamano(version.tamano)}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <a href={version.url} download={version.nombre} className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white">
              <Download size={16} />
              <span className="hidden sm:inline">Descargar</span>
            </a>
            <button type="button" onClick={() => setExpandido(false)} title="Cerrar (Esc)" className="cursor-pointer rounded-lg p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>
        {avisoHistorica}
        <div className="relative min-h-0 flex-1 bg-slate-800">{contenido}</div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md ${alto}`}>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <FileText size={18} className="text-blue-600" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">{version.nombre}</p>
            <p className="text-xs text-slate-500">PDF · {formatearTamano(version.tamano)}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button type="button" onClick={() => setExpandido(true)} title="Pantalla completa" className={BOTON}>
            <Maximize2 size={16} />
            <span className="hidden lg:inline">Ampliar</span>
          </button>
          <a href={version.url} target="_blank" rel="noopener noreferrer" title="Abrir en pestaña nueva" className={`${BOTON} px-2`}>
            <ExternalLink size={16} />
          </a>
          <span className="mx-1 h-5 w-px bg-slate-200" />
          <a href={version.url} download={version.nombre} title="Descargar" className={BOTON}>
            <Download size={16} />
            <span className="hidden lg:inline">Descargar</span>
          </a>
        </div>
      </div>

      {avisoHistorica}

      <div className="relative min-h-0 flex-1 bg-slate-100">{contenido}</div>
    </div>
  )
}
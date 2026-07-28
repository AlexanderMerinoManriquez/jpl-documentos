import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, FileWarning, Maximize2, Minus, Plus, Printer, X } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { formatearTamano } from '@/lib/expedientes'

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2.5
const ZOOM_PASO = 0.25

const BOTON = 'inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-blue-600 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:shadow-none'

export default function VisorArchivo({ version, esHistorica = false, onVerVigente, alto = 'h-[50vh] lg:h-[70vh]' }) {
  const [expandido, setExpandido] = useState(false)
  const [paginas, setPaginas] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [errorCarga, setErrorCarga] = useState(false)
  const scrollRef = useRef(null)

  const [versionId, setVersionId] = useState(version?.id)

  if (version?.id !== versionId) {
    setVersionId(version?.id)
    setPaginas(null)
    setPagina(1)
    setZoom(1)
    setErrorCarga(false)
  }

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

  const irA = (n) => {
    const destino = Math.min(Math.max(1, n), paginas ?? 1)
    setPagina(destino)
    scrollRef.current?.scrollTo({ top: 0 })
  }

  const cambiarZoom = (delta) => setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z + delta)))

  const imprimir = () => {
    const w = window.open(version.url, '_blank')
    if (w) w.addEventListener('load', () => w.print())
  }

  const barra = (oscuro = false) => (
    <div className={`flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2 ${oscuro ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => irA(pagina - 1)} disabled={pagina <= 1} className={oscuro ? BOTON.replace('text-slate-600', 'text-slate-300').replace('hover:bg-white', 'hover:bg-slate-700') : BOTON} title="Anterior">
          <ChevronLeft size={17} />
        </button>
        <span className={`px-1 text-sm tabular-nums ${oscuro ? 'text-slate-300' : 'text-slate-600'}`}>
          {pagina} / {paginas ?? '–'}
        </span>
        <button type="button" onClick={() => irA(pagina + 1)} disabled={!paginas || pagina >= paginas} className={oscuro ? BOTON.replace('text-slate-600', 'text-slate-300').replace('hover:bg-white', 'hover:bg-slate-700') : BOTON} title="Siguiente">
          <ChevronRight size={17} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button type="button" onClick={() => cambiarZoom(-ZOOM_PASO)} disabled={zoom <= ZOOM_MIN} className={oscuro ? BOTON.replace('text-slate-600', 'text-slate-300').replace('hover:bg-white', 'hover:bg-slate-700') : BOTON} title="Alejar">
          <Minus size={16} />
        </button>
        <span className={`w-12 text-center text-sm tabular-nums ${oscuro ? 'text-slate-300' : 'text-slate-600'}`}>{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => cambiarZoom(ZOOM_PASO)} disabled={zoom >= ZOOM_MAX} className={oscuro ? BOTON.replace('text-slate-600', 'text-slate-300').replace('hover:bg-white', 'hover:bg-slate-700') : BOTON} title="Acercar">
          <Plus size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button type="button" onClick={imprimir} className={oscuro ? BOTON.replace('text-slate-600', 'text-slate-300').replace('hover:bg-white', 'hover:bg-slate-700') : BOTON} title="Imprimir">
          <Printer size={16} />
        </button>
        <a href={version.url} download={version.nombre} className={oscuro ? BOTON.replace('text-slate-600', 'text-slate-300').replace('hover:bg-white', 'hover:bg-slate-700') : BOTON} title="Descargar">
          <Download size={16} />
        </a>
        {!oscuro && (
          <button type="button" onClick={() => setExpandido(true)} className={BOTON} title="Pantalla completa">
            <Maximize2 size={16} />
          </button>
        )}
        {oscuro && (
          <button type="button" onClick={() => setExpandido(false)} className={BOTON.replace('text-slate-600', 'text-slate-300').replace('hover:bg-white', 'hover:bg-slate-700')} title="Cerrar (Esc)">
            <X size={17} />
          </button>
        )}
      </div>
    </div>
  )

  const lienzo = (oscuro = false) => (
    <div ref={scrollRef} className={`relative min-h-0 flex-1 overflow-auto ${oscuro ? 'bg-slate-900' : 'bg-slate-100'}`}>
      {errorCarga ? (
        <div className="flex h-full items-center justify-center p-6 text-center">
          <p className="text-sm text-slate-400">No se pudo cargar el documento.</p>
        </div>
      ) : (
        <div className="flex justify-center py-4">
          <Document
            file={version.url}
            onLoadSuccess={({ numPages }) => setPaginas(numPages)}
            onLoadError={() => setErrorCarga(true)}
            loading={
              <div className="flex flex-col items-center gap-3 py-20">
                <div className="h-9 w-9 animate-spin rounded-full border-3 border-slate-300 border-t-blue-600" />
                <p className="text-sm text-slate-400">Cargando documento…</p>
              </div>
            }
          >
            <Page pageNumber={pagina} scale={zoom} renderTextLayer renderAnnotationLayer className="shadow-lg" />
          </Document>
        </div>
      )}
    </div>
  )

  const avisoHistorica = esHistorica && (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
      <span>Versión {version.numero} · no es la vigente</span>
      {onVerVigente && (
        <button type="button" onClick={onVerVigente} className="shrink-0 cursor-pointer font-medium underline hover:text-amber-900">Ver vigente</button>
      )}
    </div>
  )

  if (expandido) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-900">
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-700 px-4 py-2.5">
          <p className="truncate text-sm font-medium text-white">{version.nombre}</p>
          <span className="text-xs text-slate-400">{formatearTamano(version.tamano)}</span>
        </div>
        {avisoHistorica}
        {barra(true)}
        {lienzo(true)}
      </div>
    )
  }

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md ${alto}`}>
      {barra(false)}
      {avisoHistorica}
      {lienzo(false)}
    </div>
  )
}
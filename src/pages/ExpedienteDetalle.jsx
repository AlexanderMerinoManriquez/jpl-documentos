import { useState } from 'react'
import { ArrowLeft, FilePlus2, FileText, FolderOpen, Plus, RefreshCcw } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import BarraSesion from '@/components/BarraSesion'
import Boton from '@/components/Boton'
import HistorialVersiones from '@/components/HistorialVersiones'
import ListaDocumentos from '@/components/ListaDocumentos'
import ModalReemplazar from '@/components/ModalReemplazar'
import ModalNuevoDocumento from '@/components/ModalNuevoDocumento'
import VisorArchivo from '@/components/VisorArchivo'
import { useExpediente } from '@/hooks/expedientes'
import { etiquetaCodigo, nombreInstitucion } from '@/lib/constantes'
import { formatearFecha, versionActiva } from '@/lib/expedientes'
import { useSesion } from '@/lib/sesion'

export default function ExpedienteDetalle() {
  const { id } = useParams()
  const { expediente, loading, error, refetch } = useExpediente(id)
  const { usuario, permisos } = useSesion()
  const [documentoId, setDocumentoId] = useState(null)
  const [verVersion, setVerVersion] = useState(null)
  const [modalDocumento, setModalDocumento] = useState(false)
  const [modalVersion, setModalVersion] = useState(false)
  const [datosAbierto, setDatosAbierto] = useState(false)

  if (loading) return <PantallaMensaje texto="Cargando…" />
  if (error) return <PantallaMensaje texto={error} tono="error" />
  if (!expediente) return <PantallaMensaje texto="Expediente no encontrado." />

  const documentos = expediente.documentos ?? []
  const documento = documentos.find((d) => d.id === documentoId) ?? null
  const activa = versionActiva(documento)
  const mostrada = verVersion ?? activa

  const seleccionar = (doc) => {
    setDocumentoId(doc.id)
    setVerVersion(null)
    setDatosAbierto(false)
  }

  const trasCambio = () => {
    setModalDocumento(false)
    setModalVersion(false)
    setVerVersion(null)
    refetch()
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
            <ArrowLeft size={16} />
            Volver a la consulta
          </Link>
          <BarraSesion usuario={usuario} />
        </div>
      </header>
      <div className="shrink-0 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <FolderOpen size={24} className="text-blue-600" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{etiquetaCodigo(expediente.institucionId)}</span>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">{expediente.codigo}</h1>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {documentos.length} doc{documentos.length === 1 ? '' : 's'}
                </span>
              </div>
              <p className="truncate text-sm text-slate-600">{expediente.caratula}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm text-slate-400 lg:inline">{nombreInstitucion(expediente.institucionId)}</span>
            {permisos.digitalizar && (
              <Boton onClick={() => setModalDocumento(true)} className="w-full lg:w-auto">
                <Plus size={18} />
                Agregar documento
              </Boton>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 p-4 lg:flex-row lg:gap-5 lg:p-6">
        <aside className="lg:w-72 lg:shrink-0">
          <section className="flex max-h-[75vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <h2 className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              Documentos
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{documentos.length}</span>
            </h2>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ListaDocumentos documentos={documentos} seleccionado={documento} onSeleccionar={seleccionar} />
            </div>
          </section>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          {documento ? (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <FileText size={18} className="shrink-0 text-blue-600" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{documento.tipo}</p>
                    <p className="truncate text-xs text-slate-500">{documento.nombre}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {permisos.versionar && (
                    <button type="button" onClick={() => setModalVersion(true)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600">
                      <RefreshCcw size={14} />
                      Reemplazar
                    </button>
                  )}
                  <button type="button" onClick={() => setDatosAbierto((v) => !v)} className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors lg:hidden ${datosAbierto ? 'border-blue-300 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-600'}`}>
                    Datos
                  </button>
                </div>
              </div>

              <VisorArchivo version={mostrada} esHistorica={mostrada !== activa} onVerVigente={() => setVerVersion(null)} alto="h-[65vh] lg:h-[calc(100vh-15rem)]" />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                {documentos.length === 0 ? <FilePlus2 size={30} className="text-blue-600" /> : <FileText size={30} className="text-blue-600" />}
              </span>
              <div>
                {documentos.length === 0 ? (
                  <>
                    <p className="font-medium text-slate-800">Este expediente aún no tiene documentos.</p>
                    <p className="mt-1 text-sm text-slate-500">Digitaliza la primera pieza de la causa para comenzar.</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-slate-800">Selecciona un documento</p>
                    <p className="mt-1 text-sm text-slate-500">Elige una pieza de la lista para ver su contenido.</p>
                  </>
                )}
              </div>
              {documentos.length === 0 && permisos.digitalizar && (
                <Boton onClick={() => setModalDocumento(true)}>
                  <Plus size={18} />
                  Agregar el primero
                </Boton>
              )}
            </div>
          )}
        </div>
        {documento && (
          <aside className={`lg:w-72 lg:shrink-0 ${datosAbierto ? 'block' : 'hidden lg:block'}`}>
            <div className="space-y-4">
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <h3 className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Datos del documento</h3>
                <dl className="p-4">
                  <Dato label="Tipo" valor={documento.tipo} />
                  <Dato label="Nombre" valor={documento.nombre} />
                  <Dato label="Ingreso" valor={formatearFecha(documento.creadoEn, true)} />
                  <Dato label="Observaciones" valor={documento.observaciones} />
                </dl>
              </section>

              {permisos.verHistorial && (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <h3 className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                    Historial
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{documento.versiones.length}</span>
                  </h3>
                  <HistorialVersiones versiones={documento.versiones} seleccionada={mostrada} onSeleccionar={(v) => setVerVersion(v.activa ? null : v)} />
                </section>
              )}
            </div>
          </aside>
        )}
      </div>

      <ModalNuevoDocumento abierto={modalDocumento} expedienteId={expediente.id} onCerrar={() => setModalDocumento(false)} onListo={trasCambio} />
      {documento && <ModalReemplazar abierto={modalVersion} documentoId={documento.id} onCerrar={() => setModalVersion(false)} onListo={trasCambio} />}
    </div>
  )
}

function Dato({ label, valor }) {
  return (
    <div className="mb-4 last:mb-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-[15px] text-slate-800">{valor || '—'}</dd>
    </div>
  )
}

function PantallaMensaje({ texto, tono }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <p className={`text-sm ${tono === 'error' ? 'text-red-600' : 'text-slate-500'}`}>{texto}</p>
    </div>
  )
}
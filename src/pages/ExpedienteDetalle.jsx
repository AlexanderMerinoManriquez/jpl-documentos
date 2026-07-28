import { useState } from 'react'
import { ArrowLeft, FilePlus2, FolderOpen, Plus, RefreshCcw } from 'lucide-react'
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

  if (loading) return <div className="min-h-screen bg-slate-100 p-6 text-sm text-slate-500">Cargando…</div>
  if (error) return <div className="min-h-screen bg-slate-100 p-6 text-sm text-red-600">{error}</div>
  if (!expediente) return <div className="min-h-screen bg-slate-100 p-6 text-sm text-slate-500">Expediente no encontrado.</div>

  const documentos = expediente.documentos ?? []
  const documento = documentos.find((d) => d.id === documentoId) ?? documentos[0] ?? null
  const activa = versionActiva(documento)
  const mostrada = verVersion ?? activa

  const seleccionar = (doc) => {
    setDocumentoId(doc.id)
    setVerVersion(null)
  }

  const trasCambio = () => {
    setModalDocumento(false)
    setModalVersion(false)
    setVerVersion(null)
    refetch()
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800">
            <ArrowLeft size={16} />
            Volver a la consulta
          </Link>
          <BarraSesion usuario={usuario} />
        </div>

        <section className="animate-aparecer mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                <FolderOpen size={26} className="text-blue-600" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{etiquetaCodigo(expediente.institucionId)}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">{expediente.codigo}</h1>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {documentos.length} documento{documentos.length === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="mt-1 text-[15px] text-slate-600">{expediente.caratula}</p>
              </div>
            </div>

            {permisos.digitalizar && (
              <Boton onClick={() => setModalDocumento(true)} className="w-full shrink-0 sm:w-auto">
                <Plus size={18} />
                Agregar documento
              </Boton>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-sm text-slate-500">
            <span>{nombreInstitucion(expediente.institucionId)}</span>
            <span className="text-slate-300">·</span>
            <span>Ingreso {formatearFecha(expediente.creadoEn)}</span>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-4">
          <aside className="lg:col-span-1 lg:self-start lg:sticky lg:top-4">
            <section className="rounded-xl border border-slate-200 bg-white shadow-md">
              <h3 className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700">
                Documentos
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{documentos.length}</span>
              </h3>
              <ListaDocumentos documentos={documentos} seleccionado={documento} onSeleccionar={seleccionar} />
            </section>
          </aside>

          <div className="lg:col-span-2">
            {documento ? (
              <VisorArchivo version={mostrada} esHistorica={mostrada !== activa} onVerVigente={() => setVerVersion(null)} />
            ) : (
              <div className="flex h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center lg:h-[70vh]">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                  <FilePlus2 size={30} className="text-blue-600" />
                </span>
                <div>
                  <p className="font-medium text-slate-800">Este expediente aún no tiene documentos.</p>
                  <p className="mt-1 text-sm text-slate-500">Digitaliza la primera pieza de la causa para comenzar.</p>
                </div>
                {permisos.digitalizar && (
                  <Boton onClick={() => setModalDocumento(true)}>
                    <Plus size={18} />
                    Agregar el primero
                  </Boton>
                )}
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:col-span-1 lg:self-start lg:sticky lg:top-4">
            {documento && (
              <>
                <section className="rounded-xl border border-slate-200 bg-white shadow-md">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3.5">
                    <h3 className="text-sm font-semibold text-slate-700">Datos del documento</h3>
                    {permisos.versionar && (
                      <button type="button" onClick={() => setModalVersion(true)} className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-xs font-medium text-blue-600 hover:underline">
                        <RefreshCcw size={12} />
                        Reemplazar
                      </button>
                    )}
                  </div>
                  <dl className="p-4">
                    <Dato label="Tipo" valor={documento.tipo} />
                    <Dato label="Nombre" valor={documento.nombre} />
                    <Dato label="Ingreso" valor={formatearFecha(documento.creadoEn, true)} />
                    <Dato label="Observaciones" valor={documento.observaciones} />
                  </dl>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white shadow-md">
                  <h3 className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700">
                    Historial
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{documento.versiones.length}</span>
                  </h3>
                  <HistorialVersiones versiones={documento.versiones} seleccionada={mostrada} onSeleccionar={(v) => setVerVersion(v.activa ? null : v)} />
                </section>
              </>
            )}
          </aside>
        </div>

        <ModalNuevoDocumento abierto={modalDocumento} expedienteId={expediente.id} onCerrar={() => setModalDocumento(false)} onListo={trasCambio} />
        {documento && <ModalReemplazar abierto={modalVersion} documentoId={documento.id} onCerrar={() => setModalVersion(false)} onListo={trasCambio} />}
      </div>
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
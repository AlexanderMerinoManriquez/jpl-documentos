import { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
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
  const { permisos } = useSesion()
  const [documentoId, setDocumentoId] = useState(null)
  const [verVersion, setVerVersion] = useState(null)
  const [modalDocumento, setModalDocumento] = useState(false)
  const [modalVersion, setModalVersion] = useState(false)

  if (loading) return <p className="text-sm text-slate-500">Cargando…</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!expediente) return <p className="text-sm text-slate-500">Expediente no encontrado.</p>

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
    <div>
      <Link to="/expedientes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800">
        <ArrowLeft size={16} />
        Volver a expedientes
      </Link>

      <div className="mt-3 flex flex-col items-start justify-between gap-3 lg:flex-row">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{etiquetaCodigo(expediente.institucionId)}</p>
          <h2 className="text-2xl font-semibold text-slate-900 lg:text-3xl">{expediente.codigo}</h2>
          <p className="mt-1 text-[15px] text-slate-600">{expediente.caratula}</p>
          <p className="mt-0.5 text-sm text-slate-500">{nombreInstitucion(expediente.institucionId)} · Ingreso {formatearFecha(expediente.creadoEn)}</p>
        </div>
        {permisos.digitalizar && (
          <Boton onClick={() => setModalDocumento(true)} className="shrink-0">
            <Plus size={18} />
            Agregar documento
          </Boton>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <section className="rounded-xl border border-slate-200 bg-white shadow-md">
            <h3 className="border-b border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700">Documentos ({documentos.length})</h3>
            <ListaDocumentos documentos={documentos} seleccionado={documento} onSeleccionar={seleccionar} />
          </section>
        </aside>

        <div className="lg:col-span-2">
          {mostrada !== activa && (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span>Estás viendo la versión {mostrada.numero}, que no es la vigente.</span>
              <button onClick={() => setVerVersion(null)} className="shrink-0 cursor-pointer font-medium underline">Ver vigente</button>
            </div>
          )}
          <VisorArchivo version={mostrada} />
        </div>

        <aside className="space-y-5 lg:col-span-1">
          {documento && (
            <>
              <section className="rounded-xl border border-slate-200 bg-white shadow-md">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3.5">
                  <h3 className="text-sm font-semibold text-slate-700">Datos del documento</h3>
                  {permisos.versionar && (
                    <button type="button" onClick={() => setModalVersion(true)} className="shrink-0 cursor-pointer text-xs font-medium text-blue-600 hover:underline">
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
                <h3 className="border-b border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700">Historial ({documento.versiones.length})</h3>
                <HistorialVersiones versiones={documento.versiones} seleccionada={mostrada} onSeleccionar={(v) => setVerVersion(v.activa ? null : v)} />
              </section>
            </>
          )}
        </aside>
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
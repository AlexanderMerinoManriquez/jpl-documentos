import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Boton from '@/components/Boton'
import HistorialVersiones from '@/components/HistorialVersiones'
import ModalNuevaVersion from '@/components/ModalNuevaVersion'
import VisorArchivo from '@/components/VisorArchivo'
import { useDocumento } from '@/hooks/documentos'
import { etiquetaCodigo, nombreInstitucion } from '@/lib/constantes'
import { fechaUltimaActualizacion, formatearFecha, versionActiva } from '@/lib/documentos'
import { useSesion } from '@/lib/sesion'

export default function DocumentoDetalle() {
  const { id } = useParams()
  const { documento, loading, error, refetch } = useDocumento(id)
  const { permisos } = useSesion()
  const [verVersion, setVerVersion] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  if (loading) return <p className="text-sm text-slate-500">Cargando…</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!documento) return <p className="text-sm text-slate-500">Documento no encontrado.</p>

  const activa = versionActiva(documento)
  const mostrada = verVersion ?? activa

  return (
    <div>
      <Link to="/documentos" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800">
        <ArrowLeft size={16} />
        Volver a documentos
      </Link>

      <div className="mt-3 flex flex-col items-start justify-between gap-3 lg:flex-row">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 lg:text-3xl">{documento.codigo}</h2>
          <p className="mt-1 text-[15px] text-slate-600">{documento.nombre}</p>
        </div>
        {permisos.versionar && <Boton onClick={() => setModalAbierto(true)} className="shrink-0">Subir nueva versión</Boton>}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {mostrada !== activa && (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span>Estás viendo la versión {mostrada.numero}, que no es la vigente.</span>
              <button onClick={() => setVerVersion(null)} className="shrink-0 cursor-pointer font-medium underline">Ver vigente</button>
            </div>
          )}
          <VisorArchivo version={mostrada} />
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white shadow-md">
            <h3 className="border-b border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700">Datos del documento</h3>
            <dl className="p-4">
              <Dato label={etiquetaCodigo(documento.institucionId)} valor={documento.codigo} />
              <Dato label="Tipo" valor={documento.tipo} />
              <Dato label="Institución" valor={nombreInstitucion(documento.institucionId)} />
              <Dato label="Fecha de ingreso" valor={formatearFecha(documento.creadoEn, true)} />
              <Dato label="Última actualización" valor={formatearFecha(fechaUltimaActualizacion(documento), true)} />
              <Dato label="Observaciones" valor={documento.observaciones} />
            </dl>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white shadow-md">
            <h3 className="border-b border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700">Historial ({documento.versiones.length})</h3>
            <HistorialVersiones versiones={documento.versiones} seleccionada={mostrada} onSeleccionar={(v) => setVerVersion(v.activa ? null : v)} />
          </section>
        </aside>
      </div>

      <ModalNuevaVersion abierto={modalAbierto} documentoId={documento.id} onCerrar={() => setModalAbierto(false)} onListo={() => { setModalAbierto(false); setVerVersion(null); refetch() }} />
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
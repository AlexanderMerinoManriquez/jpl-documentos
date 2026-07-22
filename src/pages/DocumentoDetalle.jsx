import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import HistorialVersiones from '@/components/HistorialVersiones'
import VisorArchivo from '@/components/VisorArchivo'
import { useDocumento } from '@/hooks/documentos'
import { formatearFecha, versionActiva } from '@/lib/documentos'

export default function DocumentoDetalle() {
  const { id } = useParams()
  const { documento, loading, error } = useDocumento(id)
  const [verVersion, setVerVersion] = useState(null)

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

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{documento.rol}</h2>
          <p className="mt-1 text-sm text-slate-600">{documento.nombre}</p>
        </div>
        <button className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          Subir nueva versión
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {mostrada !== activa && (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
              <span>Estás viendo la versión {mostrada.numero}, que no es la vigente.</span>
              <button onClick={() => setVerVersion(null)} className="shrink-0 font-medium underline">Ver vigente</button>
            </div>
          )}
          <VisorArchivo version={mostrada} />
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white">
            <h3 className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">Datos del documento</h3>
            <dl className="p-4">
              <Dato label="ROL" valor={documento.rol} />
              <Dato label="Tipo" valor={documento.tipo} />
              <Dato label="Remitente" valor={documento.remitente} />
              <Dato label="Fecha del documento" valor={formatearFecha(documento.fechaDocumento)} />
              <Dato label="Observaciones" valor={documento.observaciones} />
            </dl>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white">
            <h3 className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">Historial ({documento.versiones.length})</h3>
            <HistorialVersiones versiones={documento.versiones} seleccionada={mostrada} onSeleccionar={(v) => setVerVersion(v.activa ? null : v)} />
          </section>
        </aside>
      </div>
    </div>
  )
}

function Dato({ label, valor }) {
  return (
    <div className="mb-3 last:mb-0">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-800">{valor || '—'}</dd>
    </div>
  )
}
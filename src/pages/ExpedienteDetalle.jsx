import { useState } from 'react'
import { ChevronRight, FilePlus2, FileText, FolderOpen, Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Encabezado from '@/components/Encabezado'
import PantallaMensaje from '@/components/PantallaMensaje'
import Boton from '@/components/Boton'
import ModalNuevoDocumento from '@/components/ModalNuevoDocumento'
import BotonDescargarExpediente from '@/components/BotonDescargarExpediente'
import { useExpediente } from '@/hooks/expedientes'
import { nombreDepartamento } from '@/lib/constantes'
import { formatearFecha } from '@/lib/expedientes'
import { RUTAS } from '@/lib/rutas'
import { useSesion } from '@/lib/sesion'

export default function ExpedienteDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { expediente, loading, error, refetch } = useExpediente(id)
  const { usuario, permisos } = useSesion()
  const [modalDocumento, setModalDocumento] = useState(false)

  if (loading) return <PantallaMensaje texto="Cargando…" />
  if (error) return <PantallaMensaje texto={error} tono="error" />
  if (!expediente) return <PantallaMensaje texto="Expediente no encontrado." />

  const documentos = expediente.documentos ?? []

  const trasCambio = () => {
    setModalDocumento(false)
    refetch()
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Encabezado usuario={usuario} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 lg:py-10">
        <div className="animate-aparecer">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
            <div className="h-1.5 bg-blue-600" />
            <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between lg:p-7">
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                  <FolderOpen size={28} className="text-blue-600" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">ROL</p>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">{expediente.rol}</h1>
                  <p className="mt-0.5 truncate text-[15px] text-slate-600">{expediente.caratula}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <BotonDescargarExpediente expediente={expediente} />
                {permisos.digitalizar && (
                  <Boton onClick={() => setModalDocumento(true)}>
                    <Plus size={18} />
                    Agregar documento
                  </Boton>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1.5 border-t border-slate-100 px-5 py-3.5 text-sm text-slate-500 lg:px-7">
              <span>{nombreDepartamento(expediente.departamentoId)}</span>
              <span className="text-slate-300">•</span>
              <span>Creado el {formatearFecha(expediente.creadoEn)}</span>
              <span className="text-slate-300">•</span>
              <span>{documentos.length} documento{documentos.length === 1 ? '' : 's'}</span>
            </div>
          </section>

          {documentos.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
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
          ) : (
            <>
              <h2 className="mt-8 px-1 text-sm font-semibold uppercase tracking-wide text-slate-400">Documentos de la causa</h2>
              <ol className="mt-3 space-y-3">
                {[...documentos].reverse().map((doc) => (
                  <TarjetaDocumento key={doc.id} documento={doc} onAbrir={() => navigate(RUTAS.documento(expediente.id, doc.id))} />
                ))}
              </ol>
            </>
          )}
        </div>
      </main>

      <ModalNuevoDocumento abierto={modalDocumento} expedienteId={expediente.id} onCerrar={() => setModalDocumento(false)} onListo={trasCambio} />

    </div>
  )
}

function TarjetaDocumento({ documento, onAbrir }) {
  return (
    <li>
      <button type="button" onClick={onAbrir} className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5 lg:p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <FileText size={20} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold text-slate-900">{documento.nombre}</span>
          <span className="mt-0.5 block text-xs text-slate-400">
            Ingresado el {formatearFecha(documento.creadoEn)}
          </span>
        </span>

        <ChevronRight size={20} className="shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600" />
      </button>
    </li>
  )
}
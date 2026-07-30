import { useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Trash2 } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Boton from '@/components/Boton'
import Encabezado from '@/components/Encabezado'
import PantallaMensaje from '@/components/PantallaMensaje'
import ListaDocumentos from '@/components/ListaDocumentos'
import Modal from '@/components/Modal'
import ModalNuevoDocumento from '@/components/ModalNuevoDocumento'
import BotonDescargarExpediente from '@/components/BotonDescargarExpediente'
import VisorArchivo from '@/components/VisorArchivo'
import { useEliminarDocumento, useExpediente } from '@/hooks/expedientes'
import { RUTAS } from '@/lib/rutas'
import { useSesion } from '@/lib/sesion'

const BTN = 'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600'

export default function DocumentoDetalle() {
  const { id, docId } = useParams()
  const navigate = useNavigate()
  const { expediente, loading, error, refetch } = useExpediente(id)
  const { usuario, permisos } = useSesion()
  const [modalDocumento, setModalDocumento] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)

  if (loading) return <PantallaMensaje texto="Cargando…" />
  if (error) return <PantallaMensaje texto={error} tono="error" />
  if (!expediente) return <PantallaMensaje texto="Expediente no encontrado." />

  const documentos = expediente.documentos ?? []
  const indice = documentos.findIndex((d) => d.id === Number(docId))

  if (indice < 0) return <Navigate to={RUTAS.expediente(expediente.id)} replace />

  const documento = documentos[indice]
  const anterior = indice > 0 ? documentos[indice - 1] : null
  const siguiente = indice < documentos.length - 1 ? documentos[indice + 1] : null

  const abrir = (doc) => navigate(RUTAS.documento(expediente.id, doc.id))

  const trasCambio = () => {
    setModalDocumento(false)
    refetch()
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Encabezado usuario={usuario} />

      <div className="shrink-0 border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 lg:px-6">
          <Link to={RUTAS.expediente(expediente.id)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
            <ArrowLeft size={16} />
            Documentos
          </Link>
          <span className="hidden h-6 w-px bg-slate-200 sm:block" />

          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <FileText size={18} className="shrink-0 text-blue-600" />
            <div className="min-w-0">
              <p className="flex items-center gap-2 truncate text-sm font-semibold text-slate-900">
                <span className="truncate">{documento.nombre}</span>
                <span className="hidden shrink-0 rounded-md bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-600 sm:inline">{expediente.rol}</span>
                {permisos.digitalizar && (
                  <button type="button" onClick={() => setModalEliminar(true)} title="Eliminar este documento" className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                )}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button type="button" onClick={() => abrir(anterior)} disabled={!anterior} className={`${BTN} px-2`} title={anterior ? `Anterior: ${anterior.nombre}` : 'Es el primer documento'}>
              <ChevronLeft size={16} />
            </button>
            <span className="px-0.5 text-xs tabular-nums text-slate-400">{indice + 1} / {documentos.length}</span>
            <button type="button" onClick={() => abrir(siguiente)} disabled={!siguiente} className={`${BTN} px-2`} title={siguiente ? `Siguiente: ${siguiente.nombre}` : 'Es el último documento'}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 p-4 lg:flex-row lg:gap-5 lg:p-6">
        <aside className="hidden lg:block lg:w-72 lg:shrink-0">
          <section className="flex max-h-[calc(100vh-14rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <h2 className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              Documentos
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{documentos.length}</span>
            </h2>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ListaDocumentos documentos={documentos} seleccionado={documento} onSeleccionar={abrir} onAgregar={permisos.digitalizar ? () => setModalDocumento(true) : undefined} />
            </div>
            <div className="shrink-0 border-t border-slate-200 p-3">
              <BotonDescargarExpediente expediente={expediente} className="w-full" />
            </div>
          </section>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <VisorArchivo documento={documento} alto="h-[70vh] lg:h-[calc(100vh-14rem)]" />
        </div>
      </div>

      <ModalNuevoDocumento abierto={modalDocumento} expedienteId={expediente.id} onCerrar={() => setModalDocumento(false)} onListo={trasCambio} />

      {modalEliminar && (
        <ModalEliminarDocumento
          documento={documento}
          onCerrar={() => setModalEliminar(false)}
          onEliminado={() => navigate(RUTAS.expediente(expediente.id))}
        />
      )}
    </div>
  )
}

function ModalEliminarDocumento({ documento, onCerrar, onEliminado }) {
  const { eliminar, eliminando, error } = useEliminarDocumento()

  const confirmar = async () => {
    const ok = await eliminar(documento.id)
    if (ok) onEliminado()
  }

  return (
    <Modal abierto titulo="Eliminar documento" onCerrar={onCerrar}>
      <p className="text-sm text-slate-600">
        ¿Seguro que quieres eliminar <span className="font-medium text-slate-900">{documento.nombre}</span>?
        El documento dejará de aparecer en el expediente.
      </p>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mt-5 flex justify-end gap-3">
        <Boton type="button" variante="secundario" onClick={onCerrar} disabled={eliminando}>Cancelar</Boton>
        <Boton type="button" variante="peligro" onClick={confirmar} disabled={eliminando}>
          {eliminando ? 'Eliminando…' : 'Eliminar documento'}
        </Boton>
      </div>
    </Modal>
  )
}
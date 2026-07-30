import { useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, FilePlus2, FileText, FolderOpen, Plus, Search } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import BarraSesion from '@/components/BarraSesion'
import Boton from '@/components/Boton'
import ListaDocumentos from '@/components/ListaDocumentos'
import ModalNuevoDocumento from '@/components/ModalNuevoDocumento'
import VisorArchivo from '@/components/VisorArchivo'
import { useExpediente } from '@/hooks/expedientes'
import { nombreDepartamento } from '@/lib/constantes'
import { formatearFecha } from '@/lib/expedientes'
import { useSesion } from '@/lib/sesion'
import { RUTAS } from '@/lib/rutas'

const BTN = 'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600'

export default function ExpedienteDetalle() {
  const { id } = useParams()
  const { expediente, loading, error, refetch } = useExpediente(id)
  const { usuario, permisos } = useSesion()
  const [parametros, setParametros] = useSearchParams()
  const documentoId = Number(parametros.get('doc')) || null
  const [modalDocumento, setModalDocumento] = useState(false)

  if (loading) return <PantallaMensaje texto="Cargando…" />
  if (error) return <PantallaMensaje texto={error} tono="error" />
  if (!expediente) return <PantallaMensaje texto="Expediente no encontrado." />

  const documentos = expediente.documentos ?? []
  const indice = documentos.findIndex((d) => d.id === documentoId)
  const documento = indice >= 0 ? documentos[indice] : null
  const anterior = indice > 0 ? documentos[indice - 1] : null
  const siguiente = indice >= 0 && indice < documentos.length - 1 ? documentos[indice + 1] : null

  const seleccionar = (doc) => setParametros({ doc: doc.id })
  const volver = () => setParametros({})

  const trasCambio = () => {
    setModalDocumento(false)
    refetch()
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-2 lg:px-6">
          <Link to={RUTAS.inicio} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600">
            <Search size={15} />
            Nueva consulta
          </Link>
          <BarraSesion usuario={usuario} />
        </div>
      </header>

      {documento ? (
        <>
          <div className="shrink-0 border-b border-slate-200 bg-slate-50">
            <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 lg:px-6">
              <button type="button" onClick={volver} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
                <ArrowLeft size={16} />
                Documentos
              </button>
              <span className="hidden h-6 w-px bg-slate-200 sm:block" />

              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <FileText size={18} className="shrink-0 text-blue-600" />
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate text-sm font-semibold text-slate-900">
                    {documento.nombre}
                    <span className="hidden rounded-md bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-600 sm:inline">{expediente.rol}</span>
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={() => seleccionar(anterior)} disabled={!anterior} className={`${BTN} px-2`} title={anterior ? `Anterior: ${anterior.nombre}` : 'Es el primer documento'}>
                  <ChevronLeft size={16} />
                </button>
                <span className="px-0.5 text-xs tabular-nums text-slate-400">{indice + 1} / {documentos.length}</span>
                <button type="button" onClick={() => seleccionar(siguiente)} disabled={!siguiente} className={`${BTN} px-2`} title={siguiente ? `Siguiente: ${siguiente.nombre}` : 'Es el último documento'}>
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
                  <ListaDocumentos documentos={documentos} seleccionado={documento} onSeleccionar={seleccionar} onAgregar={permisos.digitalizar ? () => setModalDocumento(true) : undefined} />
                </div>
              </section>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">

              <VisorArchivo documento={documento} alto="h-[70vh] lg:h-[calc(100vh-14rem)]" />
            </div>
          </div>
        </>
      ) : (
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 lg:py-10">
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
                {permisos.digitalizar && (
                  <Boton onClick={() => setModalDocumento(true)} className="shrink-0">
                    <Plus size={18} />
                    Agregar documento
                  </Boton>
                )}
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
                  {documentos.map((doc, i) => (
                    <TarjetaDocumento key={doc.id} documento={doc} indice={i} onAbrir={() => seleccionar(doc)} />
                  ))}
                </ol>
              </>
            )}
          </div>
        </main>
      )}

      <ModalNuevoDocumento abierto={modalDocumento} expedienteId={expediente.id} onCerrar={() => setModalDocumento(false)} onListo={trasCambio} />
    </div>
  )
}

function TarjetaDocumento({ documento, indice, onAbrir }) {
  return (
    <li>
      <button type="button" onClick={onAbrir} className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5 lg:p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold tabular-nums text-blue-700">
          {indice + 1}
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

function PantallaMensaje({ texto, tono }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <p className={`text-sm ${tono === 'error' ? 'text-red-600' : 'text-slate-500'}`}>{texto}</p>
    </div>
  )
}
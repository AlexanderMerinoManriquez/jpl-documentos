import { useState } from 'react'
import { ArrowLeft, ChevronRight, FileSearch, FolderOpen, Search } from 'lucide-react'
import ListaDocumentos from '@/components/ListaDocumentos'
import SelectorInstitucion from '@/components/SelectorInstitucion'
import VisorArchivo from '@/components/VisorArchivo'
import { expedientesApi } from '@/api/expedientes'
import { INSTITUCIONES_PUBLICAS, nombreInstitucion } from '@/lib/constantes'
import { formatearFecha, totalDocumentos, ultimoMovimiento, versionActiva } from '@/lib/expedientes'

export default function PublicoConsulta() {
  const [institucionId, setInstitucionId] = useState(INSTITUCIONES_PUBLICAS[0]?.id ?? '')
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [abierto, setAbierto] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState(null)
  const [sinResultado, setSinResultado] = useState(false)

  const buscar = async (e) => {
    e.preventDefault()
    const limpio = codigo.trim()
    if (!/^\d+-\d{4}$/.test(limpio)) {
      setError('Ingresa el ROL con el formato número-año. Ej: 1234-2026')
      return
    }
    setBuscando(true)
    setError(null)
    setSinResultado(false)
    setResultado(null)
    try {
      const data = await expedientesApi.consultaPublica(limpio, institucionId)
      if (data.length > 0) setResultado(data[0])
      else setSinResultado(true)
    } catch {
      setError('No se pudo realizar la consulta. Intenta nuevamente.')
    } finally {
      setBuscando(false)
    }
  }

  const reiniciar = () => {
    setAbierto(false)
    setResultado(null)
    setCodigo('')
    setSinResultado(false)
  }

  if (abierto && resultado) return <VistaExpediente expediente={resultado} onVolver={reiniciar} />

  const piezas = resultado ? totalDocumentos(resultado) : 0

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 shadow-md shadow-blue-600/25">
            <img src="/logo-chillan.png" alt="Municipalidad de Chillán" className="h-10 w-auto object-contain" />
          </span>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-900">Consulta de expedientes</h1>
            <p className="mt-1 text-sm text-slate-500">Juzgados de Policía Local de Chillán</p>
          </div>
        </div>

        <form onSubmit={buscar}>
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-md transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 sm:flex-row sm:items-center sm:rounded-full">
            <div className="w-full sm:w-64 sm:shrink-0">
              <SelectorInstitucion value={institucionId} opciones={INSTITUCIONES_PUBLICAS} onSeleccionar={setInstitucionId} placeholder="Seleccionar juzgado…" conTodas={false} variante="plano" />
            </div>

            <span className="h-px w-full bg-slate-100 sm:h-6 sm:w-px" />

            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ingresa el ROL. Ej: 1234-2026" className="w-full bg-transparent py-3.5 pl-11 pr-5 text-[15px] outline-none placeholder:text-slate-400" />
            </div>
          </div>

          {error && <p className="mt-3 px-2 text-center text-sm text-red-600">{error}</p>}

          <div className="mt-5 flex justify-center">
            <button type="submit" disabled={buscando} className="cursor-pointer rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg disabled:bg-slate-300 disabled:shadow-none">
              {buscando ? 'Buscando…' : 'Consultar'}
            </button>
          </div>
        </form>

        {sinResultado && (
          <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-md">
            <FileSearch size={32} className="text-slate-300" />
            <p className="text-slate-800">No se encontró ese ROL en {nombreInstitucion(institucionId)}.</p>
            <p className="text-sm text-slate-500">Verifica que esté escrito correctamente.</p>
          </div>
        )}

        {resultado && (
          <div className="mt-8">
            <p className="mb-2.5 px-1 text-sm text-slate-500">1 expediente encontrado</p>

            <button type="button" onClick={() => setAbierto(true)} className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-md transition-all hover:border-blue-300 hover:shadow-lg">
              <div className="flex items-center gap-4 p-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-100">
                  <FolderOpen size={26} className="text-blue-600" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xl font-semibold tracking-tight text-slate-900">{resultado.codigo}</p>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {piezas} documento{piezas === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[15px] text-slate-600">{resultado.caratula}</p>
                </div>

                <ChevronRight size={22} className="shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600" />
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-500">
                <span>{nombreInstitucion(resultado.institucionId)}</span>
                <span className="text-slate-300">·</span>
                <span>Último movimiento {formatearFecha(ultimoMovimiento(resultado))}</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function VistaExpediente({ expediente, onVolver }) {
  const documentos = expediente.documentos ?? []
  const [documentoId, setDocumentoId] = useState(documentos[0]?.id ?? null)
  const documento = documentos.find((d) => d.id === documentoId) ?? documentos[0] ?? null

  return (
    <div className="bg-slate-100 lg:flex lg:h-screen lg:flex-col">
      <div className="shrink-0 p-4 pb-0 lg:p-6 lg:pb-0">
        <button type="button" onClick={onVolver} className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800">
          <ArrowLeft size={16} />
          Nueva consulta
        </button>

        <section className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
          <div className="flex items-start gap-4 p-4 lg:p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 lg:h-14 lg:w-14">
              <FolderOpen size={24} className="text-blue-600" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{expediente.codigo}</h1>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {documentos.length} documento{documentos.length === 1 ? '' : 's'}
                </span>
              </div>
              <p className="mt-1 text-[15px] text-slate-600">{expediente.caratula}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-sm text-slate-500">
            <span>{nombreInstitucion(expediente.institucionId)}</span>
            <span className="text-slate-300">·</span>
            <span>Último movimiento {formatearFecha(ultimoMovimiento(expediente))}</span>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 p-4 lg:min-h-0 lg:flex-1 lg:grid-cols-4 lg:p-6">
        <aside className="lg:col-span-1 lg:min-h-0 lg:overflow-y-auto">
          <section className="rounded-xl border border-slate-200 bg-white shadow-md">
            <h2 className="border-b border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700">Documentos ({documentos.length})</h2>
            <ListaDocumentos documentos={documentos} seleccionado={documento} onSeleccionar={(d) => setDocumentoId(d.id)} />
          </section>
        </aside>

        <div className="flex flex-col lg:col-span-3 lg:min-h-0">
          {documento ? (
            <>
              <div className="mb-3 flex shrink-0 flex-wrap items-baseline gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{documento.tipo}</h2>
                <p className="truncate text-sm text-slate-500">{documento.nombre}</p>
              </div>
              <VisorArchivo version={versionActiva(documento)} alto="h-[60vh] lg:h-auto lg:min-h-0 lg:flex-1" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-16 text-center shadow-md">
              <FileSearch size={32} className="text-slate-300" />
              <p className="text-slate-800">Este expediente aún no tiene documentos digitalizados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
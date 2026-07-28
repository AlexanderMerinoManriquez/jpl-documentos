import { useState } from 'react'
import { ArrowRight, ChevronRight, FileSearch, FolderOpen, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BarraSesion from '@/components/BarraSesion'
import ModalNuevoExpediente from '@/components/ModalNuevoExpediente'
import SelectorInstitucion from '@/components/SelectorInstitucion'
import { expedientesApi } from '@/api/expedientes'
import { INSTITUCIONES_PUBLICAS, nombreInstitucion } from '@/lib/constantes'
import { formatearFecha, totalDocumentos, ultimoMovimiento } from '@/lib/expedientes'
import { useSesion } from '@/lib/sesion'

export default function PublicoConsulta() {
  const navigate = useNavigate()
  const { usuario, permisos } = useSesion()
  const [institucionId, setInstitucionId] = useState(INSTITUCIONES_PUBLICAS[0]?.id ?? '')
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [modalNuevo, setModalNuevo] = useState(false)
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

  const piezas = resultado ? totalDocumentos(resultado) : 0

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-100">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-96 w-2xl -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-slate-200/50 blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-end px-4 py-3 lg:px-6">
        <BarraSesion usuario={usuario} />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <div className="mb-9 flex flex-col items-center gap-4">
            <span className="flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 shadow-lg shadow-blue-600/30 ring-4 ring-blue-600/10">
              <img src="/logo-chillan.png" alt="Municipalidad de Chillán" className="h-10 w-auto object-contain" />
            </span>
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 lg:text-4xl">Consulta de expedientes</h1>
              <p className="mt-1.5 text-sm text-slate-500">Juzgados de Policía Local · Municipalidad de Chillán</p>
            </div>
          </div>

          <form onSubmit={buscar}>
            <div className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5 transition-all focus-within:border-blue-400 focus-within:shadow-xl focus-within:ring-4 focus-within:ring-blue-100 sm:flex-row sm:items-center sm:rounded-full">
              <div className="w-full sm:w-72 sm:shrink-0">
                <SelectorInstitucion value={institucionId} opciones={INSTITUCIONES_PUBLICAS} onSeleccionar={setInstitucionId} placeholder="Seleccionar juzgado…" conTodas={false} variante="plano" />
              </div>

              <span className="h-px w-full bg-slate-100 sm:h-8 sm:w-px" />

              <div className="relative flex-1">
                <Search size={19} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ingresa el ROL. Ej: 1234-2026" className="w-full bg-transparent py-4 pl-12 pr-4 text-base outline-none placeholder:text-slate-400" />
              </div>

              <button type="submit" disabled={buscando} title="Consultar" className="mr-1.5 hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-lg disabled:bg-slate-300 disabled:shadow-none sm:flex">
                {buscando
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  : <ArrowRight size={19} />}
              </button>
            </div>

            {error && <p className="mt-3 px-2 text-center text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={buscando} className="mt-4 w-full cursor-pointer rounded-xl bg-blue-600 py-3 text-sm font-medium text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:bg-slate-300 sm:hidden">
              {buscando ? 'Buscando…' : 'Consultar'}
            </button>
          </form>

          {permisos.digitalizar && (
            <div className="mt-7 flex justify-center">
              <button type="button" onClick={() => setModalNuevo(true)} className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-dashed border-slate-300 bg-white/70 px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur transition-all hover:border-blue-400 hover:bg-white hover:text-blue-700 hover:shadow-md">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white transition-transform duration-200 group-hover:rotate-90">
                  <Plus size={13} />
                </span>
                Registrar nueva causa
              </button>
            </div>
          )}

          {sinResultado && (
            <div className="animate-aparecer mt-8 flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-md">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <FileSearch size={26} className="text-slate-400" />
              </span>
              <div>
                <p className="font-medium text-slate-800">No se encontró ese ROL en {nombreInstitucion(institucionId)}.</p>
                <p className="mt-1 text-sm text-slate-500">Verifica que esté escrito correctamente.</p>
              </div>
            </div>
          )}

          {resultado && (
            <div className="animate-aparecer mt-8">
              <p className="mb-2.5 px-1 text-sm text-slate-500">1 expediente encontrado</p>

              <button type="button" onClick={() => navigate(`/expedientes/${resultado.id}`)} className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-md transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg">
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

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-300 transition-all group-hover:bg-blue-600 group-hover:text-white">
                    <ChevronRight size={20} />
                  </span>
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
      </main>

      <footer className="relative z-10 shrink-0 pb-5 text-center text-xs text-slate-400">
        Archivador Digital · Municipalidad de Chillán
      </footer>

      <ModalNuevoExpediente
        abierto={modalNuevo}
        institucionFija={usuario?.institucionId ?? institucionId}
        onCerrar={() => setModalNuevo(false)}
        onCreado={(exp) => navigate(`/expedientes/${exp.id}`)}
      />
    </div>
  )
}
import { useState } from 'react'
import { ArrowRight, FileSearch, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BarraSesion from '@/components/BarraSesion'
import Boton from '@/components/Boton'
import ModalNuevoExpediente from '@/components/ModalNuevoExpediente'
import SelectorInstitucion from '@/components/SelectorInstitucion'
import { useBusquedaPublica } from '@/hooks/expedientes'
import { INSTITUCIONES_PUBLICAS, nombreInstitucion, ROL_REGEX } from '@/lib/constantes'
import { useSesion } from '@/lib/sesion'

export default function PublicoConsulta() {
  const navigate = useNavigate()
  const { usuario, permisos } = useSesion()
  const [modalNuevo, setModalNuevo] = useState(false)
  const { codigo, institucionId, buscando, error, sinResultado, escribir, cambiarInstitucion, buscar } =
    useBusquedaPublica(INSTITUCIONES_PUBLICAS[0]?.id ?? '')

  const enviar = async (e) => {
    const expediente = await buscar(e)
    if (expediente) navigate(`/expedientes/${expediente.id}`)
  }

  const rolEscrito = codigo.trim()

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-100">
      <FondoDecorativo />

      <header className="relative z-30 flex items-center justify-between px-4 py-3 lg:px-6">
        <img src="/logo-chillan-letras.png" alt="Municipalidad de Chillán" className="h-12 w-auto object-contain" />
        <BarraSesion usuario={usuario} />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center px-4 pt-[16vh]">
        <div className="w-full max-w-3xl">
          <h1 className="mb-9 text-center text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl">Archivador Digital</h1>

          <form onSubmit={enviar}>
            <div className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 transition-all focus-within:border-blue-400 focus-within:shadow-2xl focus-within:ring-4 focus-within:ring-blue-100 sm:flex-row sm:items-center sm:rounded-full">
              <div className="w-full sm:w-64 sm:shrink-0">
                <SelectorInstitucion value={institucionId} opciones={INSTITUCIONES_PUBLICAS} onSeleccionar={cambiarInstitucion} placeholder="Seleccionar juzgado…" variante="plano" />
              </div>

              <span className="h-px w-full bg-slate-100 sm:h-8 sm:w-px" />

              <div className="relative flex-1">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={codigo} onChange={escribir} placeholder="Ingresa el ROL. Ej: 1234-2026" className="w-full bg-transparent py-4 pl-12 pr-4 text-base outline-none placeholder:text-slate-400" />
              </div>

              <button type="submit" disabled={buscando} title="Consultar" className="mr-2 hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none sm:flex">
                {buscando
                  ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  : <ArrowRight size={20} />}
              </button>
            </div>

            {error && <p className="animate-aparecer mt-3 px-2 text-center text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={buscando} className="mt-4 w-full cursor-pointer rounded-2xl bg-blue-600 py-4 text-base font-medium text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:bg-slate-300 sm:hidden">
              {buscando ? 'Buscando…' : 'Consultar'}
            </button>
          </form>

          {permisos.digitalizar && (
            <div className="mt-9 flex justify-center">
              <Boton onClick={() => setModalNuevo(true)} className="w-full sm:w-auto">
                <Plus size={18} />
                Nueva Causa
              </Boton>
            </div>
          )}

          {sinResultado && (
            <SinResultado
              rol={rolEscrito}
              institucionId={institucionId}
              puedeRegistrar={permisos.digitalizar}
              onRegistrar={() => setModalNuevo(true)}
            />
          )}
        </div>
      </main>

      <footer className="relative z-10 shrink-0 pb-5 text-center text-xs text-slate-400">
        Archivador Digital · Municipalidad de Chillán
      </footer>

      {modalNuevo && (
        <ModalNuevoExpediente
          abierto
          institucionFija={usuario?.institucionId ?? institucionId}
          codigoInicial={ROL_REGEX.test(rolEscrito) ? rolEscrito : ''}
          onCerrar={() => setModalNuevo(false)}
          onCreado={(exp) => navigate(`/expedientes/${exp.id}`)}
        />
      )}
    </div>
  )
}

function FondoDecorativo() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -top-40 left-1/2 h-96 w-2xl -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-slate-200/50 blur-3xl" />
    </div>
  )
}

function SinResultado({ rol, institucionId, puedeRegistrar, onRegistrar }) {
  return (
    <div className="animate-aparecer mt-8 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-md">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <FileSearch size={26} className="text-slate-400" />
      </span>
      <div>
        <p className="font-medium text-slate-800">No se encontró el ROL {rol} en {nombreInstitucion(institucionId)}.</p>
        <p className="mt-1 text-sm text-slate-500">Verifica que esté escrito correctamente.</p>
      </div>
      {puedeRegistrar && (
        <Boton onClick={onRegistrar}>
          <Plus size={18} />
          Registrar esta causa
        </Boton>
      )}
    </div>
  )
}
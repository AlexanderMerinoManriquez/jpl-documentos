import { useRef, useState } from 'react'
import { ArrowRight, ChevronDown, ChevronRight, FileSearch, FolderOpen, History, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BarraSesion from '@/components/BarraSesion'
import Boton from '@/components/Boton'
import ModalNuevoExpediente from '@/components/ModalNuevoExpediente'
import { useBusquedaPublica, useRecientes } from '@/hooks/expedientes'
import { useClickAfuera } from '@/hooks/ui'
import { nombreDepartamento, ROL_REGEX } from '@/lib/constantes'
import { RUTAS } from '@/lib/rutas'
import { useSesion } from '@/lib/sesion'

export default function Inicio() {
  const navigate = useNavigate()
  const { usuario, permisos } = useSesion()
  const [modalNuevo, setModalNuevo] = useState(false)
  const busqueda = useBusquedaPublica(usuario.departamentoId)

  const enviar = async (e) => {
    const expediente = await busqueda.buscar(e)
    if (expediente) navigate(RUTAS.expediente(expediente.id))
  }

  const rolEscrito = busqueda.rol.trim()

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

          <BuscadorExpediente
            rol={busqueda.rol}
            buscando={busqueda.buscando}
            error={busqueda.error}
            onEscribir={busqueda.escribir}
            onEnviar={enviar}
          />

          {permisos.digitalizar && (
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <MenuRecientes onAbrir={(exp) => navigate(RUTAS.expediente(exp.id))} />
              <Boton onClick={() => setModalNuevo(true)}>
                <Plus size={18} />
                Nueva Causa
              </Boton>
            </div>
          )}

          {busqueda.sinResultado && (
            <SinResultado
              rol={rolEscrito}
              departamentoId={usuario.departamentoId}
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
          departamentoFijo={usuario?.departamentoId ?? busqueda.departamentoId}
          rolInicial={ROL_REGEX.test(rolEscrito) ? rolEscrito : ''}
          onCerrar={() => setModalNuevo(false)}
          onCreado={(exp) => navigate(RUTAS.expediente(exp.id))}
        />
      )}
    </div>
  )
}

function MenuRecientes({ onAbrir }) {
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)
  const { cargando, recientes, error } = useRecientes()
  useClickAfuera(contenedor, abierto, () => setAbierto(false))

  return (
    <div ref={contenedor} className="relative">
      <Boton variante="secundario" onClick={() => setAbierto((v) => !v)} className={abierto ? 'border-blue-300 bg-blue-50 text-blue-700' : 'hover:border-blue-200 hover:text-blue-700'}>
        <History size={17} className="text-blue-600" />
        Recientes
        <ChevronDown size={16} className={`transition-transform ${abierto ? 'rotate-180' : ''}`} />
      </Boton>

      {abierto && (
        <div className="animate-aparecer absolute left-1/2 z-20 mt-2 w-80 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <History size={15} className="text-blue-600" />
            <p className="text-sm font-semibold text-slate-700">Tus últimas causas</p>
          </div>

          {cargando && <p className="px-4 py-4 text-sm text-slate-400">Cargando…</p>}
          {error && <p className="px-4 py-4 text-sm text-red-600">{error}</p>}
          {!cargando && !error && recientes.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-slate-400">Aún no has trabajado en ninguna causa.</p>
          )}

          <div className="max-h-80 overflow-y-auto py-1.5">
          {recientes.map((exp) => (
            <button key={exp.id} type="button" onClick={() => onAbrir(exp)} className="group flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                <FolderOpen size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold tabular-nums text-slate-800 group-hover:text-blue-700">{exp.rol}</span>
                <span className="block truncate text-xs text-slate-500">{exp.caratula}</span>
              </span>
              <ChevronRight size={16} className="shrink-0 text-slate-300 group-hover:text-blue-600" />
            </button>
          ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BuscadorExpediente({ rol, buscando, error, onEscribir, onEnviar }) {
  return (
    <form onSubmit={onEnviar}>
      <div className="flex items-center rounded-full border border-slate-200 bg-white shadow-xl shadow-slate-900/5 transition-all focus-within:border-blue-400 focus-within:shadow-2xl focus-within:ring-4 focus-within:ring-blue-100">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={rol} onChange={onEscribir} placeholder="Ingresa el ROL. Ej: 1234-2026" className="w-full bg-transparent py-4 pl-12 pr-4 text-base outline-none placeholder:text-slate-400" />
        </div>

        <button type="submit" disabled={buscando} title="Consultar" className="mr-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none">
          {buscando
            ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            : <ArrowRight size={20} />}
        </button>
      </div>

      {error && <p className="animate-aparecer mt-3 px-2 text-center text-sm text-red-600">{error}</p>}
    </form>
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

function SinResultado({ rol, departamentoId, puedeRegistrar, onRegistrar }) {
  return (
    <div className="animate-aparecer mt-8 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-md">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <FileSearch size={26} className="text-slate-400" />
      </span>
      <div>
        <p className="font-medium text-slate-800">No se encontró el ROL {rol} en {nombreDepartamento(departamentoId)}.</p>
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
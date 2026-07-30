import { useState } from 'react'
import { FileSearch, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BarraSesion from '@/components/BarraSesion'
import Boton from '@/components/Boton'
import BuscadorExpediente from '@/components/BuscadorExpediente'
import ModalNuevoExpediente from '@/components/ModalNuevoExpediente'
import { useBusquedaPublica } from '@/hooks/expedientes'
import { DEPARTAMENTOS_PUBLICOS, nombreDepartamento, ROL_REGEX } from '@/lib/constantes'
import { RUTAS } from '@/lib/rutas'
import { useSesion } from '@/lib/sesion'

export default function Inicio() {
  const navigate = useNavigate()
  const { usuario, permisos } = useSesion()
  const [modalNuevo, setModalNuevo] = useState(false)
  const busqueda = useBusquedaPublica(DEPARTAMENTOS_PUBLICOS[0]?.id ?? '')

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
            departamentoId={busqueda.departamentoId}
            buscando={busqueda.buscando}
            error={busqueda.error}
            onEscribir={busqueda.escribir}
            onDepartamento={busqueda.cambiarDepartamento}
            onEnviar={enviar}
          />

          {permisos.digitalizar && (
            <div className="mt-9 flex justify-center">
              <Boton onClick={() => setModalNuevo(true)} className="w-full sm:w-auto">
                <Plus size={18} />
                Nueva Causa
              </Boton>
            </div>
          )}

          {busqueda.sinResultado && (
            <SinResultado
              rol={rolEscrito}
              departamentoId={busqueda.departamentoId}
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
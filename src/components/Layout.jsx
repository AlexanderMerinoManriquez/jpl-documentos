import { useState } from 'react'
import { ChevronDown, FileText, LayoutDashboard, Menu, Upload, User, X } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useSesion } from '@/lib/sesion'

const NAVEGACION = [
  { to: '/documentos', icon: FileText, label: 'Documentos', descripcion: 'Consulta y búsqueda', permiso: null },
  { to: '/documentos/nuevo', icon: Upload, label: 'Digitalizar', descripcion: 'Subir documento escaneado', permiso: 'digitalizar' },
  { to: '/estadisticas', icon: LayoutDashboard, label: 'Estadísticas', descripcion: 'Resumen de actividad', permiso: 'estadisticas' },
]

export default function Layout() {
  const { permisos } = useSesion()
  const [abierto, setAbierto] = useState(false)
  const [rutaVista, setRutaVista] = useState(null)
  const { pathname } = useLocation()

  if (pathname !== rutaVista) {
    setRutaVista(pathname)
    setAbierto(false)
  }

  const items = NAVEGACION.filter((i) => !i.permiso || permisos[i.permiso])

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <button type="button" onClick={() => setAbierto(true)} className="cursor-pointer rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100">
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center rounded-lg bg-blue-600 px-2 py-1.5">
            <img src="/logo-chillan.png" alt="" className="h-5 w-auto object-contain" />
          </span>
          <p className="text-base font-semibold text-slate-900">Archivador Digital</p>
        </div>
      </header>

      {abierto && <div onClick={() => setAbierto(false)} className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white shadow-md transition-transform duration-200 lg:static lg:translate-x-0 ${abierto ? 'translate-x-0' : '-translate-x-full'}`}>
        <button type="button" onClick={() => setAbierto(false)} className="absolute right-3 top-3 cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 lg:hidden">
          <X size={18} />
        </button>

        <div className="flex flex-col items-center gap-3 px-5 py-6">
          <div className="flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-5 shadow-md shadow-blue-600/25">
            <img src="/logo-chillan.png" alt="Municipalidad de Chillán" className="h-9 w-auto object-contain" />
          </div>
          <div className="text-center leading-tight">
            <p className="text-lg font-semibold text-slate-900">Archivador Digital</p>
            <p className="text-sm text-slate-500">Municipalidad de Chillán</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
          {items.map(({ to, icon: Icon, label, descripcion }) => (
            <NavLink key={to} to={to} end={to === '/documentos'} className={({ isActive }) => `relative flex items-start gap-3 rounded-xl px-3 py-3 transition-colors ${isActive ? 'bg-blue-50 shadow-sm' : 'hover:bg-slate-50'}`}>
              {({ isActive }) => (
                <>
                  <Icon size={20} className={`mt-0.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="leading-snug">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{label}</p>
                    <p className={`text-xs ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>{descripcion}</p>
                  </div>
                  {isActive && <span className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-blue-600" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200">
              <User size={18} className="text-slate-500" />
            </span>
            <span className="flex-1 text-sm text-slate-400">Sin sesión</span>
            <ChevronDown size={16} className="shrink-0 text-slate-300" />
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto">
        <div className="mx-auto max-w-7xl p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
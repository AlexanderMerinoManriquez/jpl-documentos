import { ChevronDown, FileText, LayoutDashboard, Upload, User } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const navegacion = [
  {
    to: '/documentos',
    icon: FileText,
    label: 'Documentos',
    descripcion: 'Consulta y búsqueda',
  },
  {
    to: '/documentos/nuevo',
    icon: Upload,
    label: 'Digitalizar',
    descripcion: 'Subir documento escaneado',
  },
  {
    to: '/estadisticas',
    icon: LayoutDashboard,
    label: 'Estadísticas',
    descripcion: 'Resumen de actividad',
  },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-3 px-6 py-7">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold tracking-tight text-white">JPL</div>
          <div className="text-center leading-tight">
            <p className="text-lg font-semibold text-slate-900">JPL Documentos</p>
            <p className="text-sm text-slate-500">Oficina de Partes</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
          {navegacion.map(({ to, icon: Icon, label, descripcion }) => (
            <NavLink key={to} to={to} end={to === '/documentos'} className={({ isActive }) => `relative flex items-start gap-3 rounded-xl px-3 py-3 transition-colors ${isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
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
        <div className="mx-auto max-w-7xl p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
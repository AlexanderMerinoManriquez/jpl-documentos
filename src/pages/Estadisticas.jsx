import { useState } from 'react'
import { Building2, FileText, Layers, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'
import SelectorInstitucion from '@/components/SelectorInstitucion'
import { useDocumentos } from '@/hooks/documentos'
import { useEstadisticas } from '@/hooks/useEstadisticas'
import { INSTITUCIONES, nombreInstitucion } from '@/lib/constantes'
import { formatearFecha } from '@/lib/documentos'
import { useSesion } from '@/lib/sesion'

const COLORES = ['#2563eb', '#0ea5e9', '#6366f1', '#8b5cf6', '#14b8a6', '#f59e0b']
const EJE = { fontSize: 12, fill: '#64748b' }
const TOOLTIP = { borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }

export default function Estadisticas() {
  const { documentos, loading, error } = useDocumentos()
  const { permisos, institucionFija } = useSesion()
  const [seleccion, setSeleccion] = useState('')

  const institucionId = institucionFija || seleccion
  const stats = useEstadisticas(documentos, institucionId)

  if (!permisos.estadisticas) {
    return <p className="text-sm text-slate-500">No tienes permisos para ver esta sección.</p>
  }

  if (loading) return <p className="text-sm text-slate-500">Cargando…</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 lg:text-3xl">Estadísticas</h2>
          <p className="mt-1 text-sm text-slate-500">{institucionId ? nombreInstitucion(institucionId) : 'Todas las instituciones'}</p>
        </div>
        {permisos.todasInstituciones && (
          <SelectorInstitucion value={seleccion} opciones={INSTITUCIONES} onSeleccionar={setSeleccion} className="lg:w-80" />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Tarjeta icono={FileText} label="Documentos digitalizados" valor={stats.total} />
        <Tarjeta icono={Layers} label="Archivos subidos" valor={stats.totalVersiones} />
        <Tarjeta icono={Users} label="Funcionarios activos" valor={stats.porFuncionario.length} />
        <Tarjeta icono={Building2} label="Instituciones" valor={stats.porInstitucion.length} />
      </div>

      <Panel titulo="Digitalizaciones por funcionario">
        {stats.porFuncionario.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">Sin datos de funcionarios.</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(180, stats.porFuncionario.length * 44)}>
            <BarChart data={stats.porFuncionario} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={EJE} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="nombre" width={150} tick={EJE} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={TOOLTIP} />
              <Bar dataKey="total" fill="#2563eb" radius={[0, 6, 6, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel titulo="Digitalizaciones por mes">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.porMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="nombre" tick={EJE} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={EJE} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={TOOLTIP} />
              <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel titulo="Por tipo de documento">
          {stats.porTipo.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">Sin datos.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={stats.porTipo} dataKey="total" nameKey="nombre" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {stats.porTipo.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                {stats.porTipo.map((t, i) => (
                  <li key={t.nombre} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORES[i % COLORES.length] }} />
                    {t.nombre} ({t.total})
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>
      </div>

      {!institucionId && stats.porInstitucion.length > 1 && (
        <Panel titulo="Por institución">
          <ul className="space-y-3">
            {stats.porInstitucion.map((i) => (
              <li key={i.nombre}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-slate-700">{i.nombre}</span>
                  <span className="shrink-0 font-medium text-slate-900">{i.total}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${(i.total / stats.total) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel titulo="Últimos documentos digitalizados">
        {stats.recientes.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">Sin documentos.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {stats.recientes.map((d) => (
              <li key={d.id}>
                <Link to={`/documentos/${d.id}`} className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-slate-50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-blue-600">{d.codigo}</p>
                    <p className="truncate text-sm text-slate-600">{d.nombre}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{formatearFecha(d.creadoEn)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  )
}

function Tarjeta({ icono: Icono, label, valor }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
        <Icono size={22} className="text-blue-600" />
      </span>
      <div>
        <p className="text-2xl font-semibold text-slate-900">{valor}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}

function Panel({ titulo, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-md">
      <h3 className="border-b border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700">{titulo}</h3>
      <div className="p-5">{children}</div>
    </section>
  )
}
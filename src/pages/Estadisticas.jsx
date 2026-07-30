import { ChartColumn } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import Encabezado from '@/components/Encabezado'
import PantallaMensaje from '@/components/PantallaMensaje'
import { useEstadisticas } from '@/hooks/expedientes'
import { colorEstado, nombreEstado } from '@/lib/constantes'
import { RUTAS } from '@/lib/rutas'
import { useSesion } from '@/lib/sesion'

export default function Estadisticas() {
  const { usuario, permisos } = useSesion()
  const { cargando, datos, error } = useEstadisticas()

  if (!permisos.estadisticas) return <Navigate to={RUTAS.inicio} replace />
  if (cargando) return <PantallaMensaje texto="Cargando…" />
  if (error) return <PantallaMensaje texto={error} tono="error" />

  const porEstado = Object.entries(datos?.porEstado ?? {}).sort((a, b) => b[1] - a[1])
  const porMes = datos?.porMes ?? []

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Encabezado usuario={usuario} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 lg:py-10">
        <div className="animate-aparecer">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <ChartColumn size={22} className="text-blue-600" />
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Estadísticas</h1>
                <p className="text-sm text-slate-500">Expedientes por estado</p>
              </div>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Estados provisionales</span>
          </div>

          <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <TarjetaResumen etiqueta="Total de causas" valor={datos?.total ?? 0} destacada />
            {porEstado.map(([estado, total]) => (
              <TarjetaResumen key={estado} etiqueta={nombreEstado(estado)} valor={total} color={colorEstado(estado)} />
            ))}
          </section>

          <section className="mt-8">
            <h2 className="px-1 text-sm font-semibold uppercase tracking-wide text-slate-400">Por mes</h2>
            {porMes.length === 0 ? (
              <p className="mt-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Aún no hay datos mensuales.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {porMes.map(({ mes, estados }) => (
                  <BarraMes key={mes} mes={mes} estados={estados} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

function TarjetaResumen({ etiqueta, valor, color, destacada }) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${destacada ? 'border-blue-200 bg-blue-50/60' : 'border-slate-200 bg-white'}`}>
      <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        {color && <span className={`h-2 w-2 rounded-full ${color}`} />}
        {etiqueta}
      </p>
      <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{valor}</p>
    </div>
  )
}

function BarraMes({ mes, estados }) {
  const entradas = Object.entries(estados)
  const total = entradas.reduce((suma, [, n]) => suma + n, 0)
  const nombreMes = new Date(`${mes}-02`).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium capitalize text-slate-800">{nombreMes}</p>
        <p className="text-xs tabular-nums text-slate-500">{total} causa{total === 1 ? '' : 's'}</p>
      </div>

      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
        {entradas.map(([estado, n]) => (
          <span key={estado} className={colorEstado(estado)} style={{ width: `${(n / total) * 100}%` }} title={`${nombreEstado(estado)}: ${n}`} />
        ))}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
        {entradas.map(([estado, n]) => (
          <span key={estado} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className={`h-2 w-2 rounded-full ${colorEstado(estado)}`} />
            {nombreEstado(estado)} · {n}
          </span>
        ))}
      </div>
    </div>
  )
}
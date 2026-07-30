export const DEPARTAMENTOS = [
  { id: 'jpl1', codigo: 'JPL1', nombre: 'Juzgado De Policía Local 1', publica: true },
  { id: 'jpl2', codigo: 'JPL2', nombre: 'Juzgado De Policía Local 2', publica: true },
]

export const DEPARTAMENTOS_PUBLICOS = DEPARTAMENTOS.filter((d) => d.publica)

export const ROL_REGEX = /^\d+-\d{4}$/

export const ESTADOS = [
  { id: 'ingresada', nombre: 'Ingresada', color: 'bg-blue-500' },
  { id: 'en_tramite', nombre: 'En trámite', color: 'bg-amber-500' },
  { id: 'resuelta', nombre: 'Resuelta', color: 'bg-emerald-500' },
]

export const nombreEstado = (id) => ESTADOS.find((e) => e.id === id)?.nombre ?? 'Sin estado'
export const colorEstado = (id) => ESTADOS.find((e) => e.id === id)?.color ?? 'bg-slate-400'

export const nombreDepartamento = (departamentoId) =>
  DEPARTAMENTOS.find((d) => d.id === departamentoId)?.nombre ?? '—'

/* Estilo */
export const CAMPO = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[15px] text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
// Departamentos municipales que usan el archivador (alineado a la tabla `departamento` de la BD).
export const DEPARTAMENTOS = [
  { id: 'jpl1', codigo: 'JPL1', nombre: 'Juzgado De Policía Local 1', publica: true },
  { id: 'jpl2', codigo: 'JPL2', nombre: 'Juzgado De Policía Local 2', publica: true },
]

export const DEPARTAMENTOS_PUBLICOS = DEPARTAMENTOS.filter((d) => d.publica)

export const ROL_REGEX = /^\d+-\d{4}$/

export const nombreDepartamento = (departamentoId) =>
  DEPARTAMENTOS.find((d) => d.id === departamentoId)?.nombre ?? '—'

/* Estilo */
export const CAMPO = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[15px] text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
export const TIPOS = [
  'Denuncia',
  'Parte policial',
  'Citación',
  'Acta de comparendo',
  'Resolución',
  'Sentencia',
  'Notificación',
  'Comprobante',
  'Oficio',
  'Otro',
]

export const INSTITUCIONES = [
  { id: 'jpl1', nombre: 'Juzgado De Policía Local 1', etiquetaCodigo: 'ROL', publica: true },
  { id: 'jpl2', nombre: 'Juzgado De Policía Local 2', etiquetaCodigo: 'ROL', publica: true },
]

export const INSTITUCIONES_PUBLICAS = INSTITUCIONES.filter((i) => i.publica)

export const ETIQUETA_CODIGO_POR_DEFECTO = 'Código'

export const etiquetaCodigo = (institucionId) =>
  INSTITUCIONES.find((i) => i.id === institucionId)?.etiquetaCodigo ?? ETIQUETA_CODIGO_POR_DEFECTO

export const nombreInstitucion = (institucionId) =>
  INSTITUCIONES.find((i) => i.id === institucionId)?.nombre ?? '—'

export const etiquetaCodigoActiva = (institucionId) => {
  if (institucionId) return etiquetaCodigo(institucionId)
  const etiquetas = new Set(INSTITUCIONES.map((i) => i.etiquetaCodigo))
  return etiquetas.size === 1 ? [...etiquetas][0] : ETIQUETA_CODIGO_POR_DEFECTO
}

/* Estilo*/
export const CAMPO = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[15px] text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
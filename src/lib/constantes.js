export const TIPOS = ['Oficio', 'Resolución', 'Solicitud', 'Notificación', 'Comprobante', 'Otro']

export const INSTITUCIONES = [
  { id: 'jpl1', nombre: 'Juzgado De Policía Local 1', etiquetaCodigo: 'ROL' },
  { id: 'jpl2', nombre: 'Juzgado De Policía Local 2', etiquetaCodigo: 'ROL' },
]

export const ETIQUETA_CODIGO_POR_DEFECTO = 'Código'

export const etiquetaCodigo = (institucionId) =>
  INSTITUCIONES.find((i) => i.id === institucionId)?.etiquetaCodigo ?? ETIQUETA_CODIGO_POR_DEFECTO

export const nombreInstitucion = (institucionId) =>
  INSTITUCIONES.find((i) => i.id === institucionId)?.nombre ?? '—'
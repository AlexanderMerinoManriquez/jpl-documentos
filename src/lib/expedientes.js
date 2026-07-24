export const versionActiva = (documento) => documento?.versiones?.find((v) => v.activa) ?? null

export const totalDocumentos = (expediente) => expediente?.documentos?.length ?? 0

export const ultimoMovimiento = (expediente) => {
  const fechas = (expediente?.documentos ?? [])
    .map((d) => versionActiva(d)?.subidoEn)
    .filter(Boolean)
  return fechas.length ? fechas.sort().at(-1) : (expediente?.creadoEn ?? null)
}

export const formatearTamano = (bytes) => {
  if (!bytes) return '—'
  const mb = bytes / 1024 / 1024
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

export const formatearFecha = (iso, conHora = false) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(conHora && { hour: '2-digit', minute: '2-digit' }),
  })
}
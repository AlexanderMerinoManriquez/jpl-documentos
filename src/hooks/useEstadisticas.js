import { useMemo } from 'react'
import { nombreInstitucion } from '@/lib/constantes'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const SIN_DATO = 'Sin identificar'

const agrupar = (entradas) =>
  Object.entries(
    entradas.reduce((acc, k) => {
      const clave = k || SIN_DATO
      acc[clave] = (acc[clave] ?? 0) + 1
      return acc
    }, {})
  )
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total)

export function useEstadisticas(expedientes, institucionId = '') {
  return useMemo(() => {
    const causas = institucionId ? expedientes.filter((e) => e.institucionId === institucionId) : expedientes
    const documentos = causas.flatMap((e) => e.documentos ?? [])
    const versiones = documentos.flatMap((d) => d.versiones ?? [])

    const hoy = new Date()
    const meses = Array.from({ length: 6 }, (_, i) => {
      const f = new Date(hoy.getFullYear(), hoy.getMonth() - (5 - i), 1)
      return { clave: `${f.getFullYear()}-${f.getMonth()}`, nombre: MESES[f.getMonth()], total: 0 }
    })

    versiones.forEach((v) => {
      if (!v.subidoEn) return
      const f = new Date(v.subidoEn)
      const mes = meses.find((m) => m.clave === `${f.getFullYear()}-${f.getMonth()}`)
      if (mes) mes.total += 1
    })

    return {
      totalCausas: causas.length,
      totalDocumentos: documentos.length,
      totalVersiones: versiones.length,
      porInstitucion: agrupar(causas.map((e) => nombreInstitucion(e.institucionId))),
      porTipo: agrupar(documentos.map((d) => d.tipo)),
      porFuncionario: agrupar(versiones.map((v) => v.subidoPor)),
      porMes: meses.map(({ nombre, total }) => ({ nombre, total })),
      recientes: [...causas].sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn)).slice(0, 5),
    }
  }, [expedientes, institucionId])
}
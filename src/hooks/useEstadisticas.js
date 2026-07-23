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

export function useEstadisticas(documentos, institucionId = '') {
  return useMemo(() => {
    const docs = institucionId ? documentos.filter((d) => d.institucionId === institucionId) : documentos
    const versiones = docs.flatMap((d) => d.versiones ?? [])

    const hoy = new Date()
    const meses = Array.from({ length: 6 }, (_, i) => {
      const f = new Date(hoy.getFullYear(), hoy.getMonth() - (5 - i), 1)
      return { clave: `${f.getFullYear()}-${f.getMonth()}`, nombre: MESES[f.getMonth()], total: 0 }
    })

    docs.forEach((d) => {
      if (!d.creadoEn) return
      const f = new Date(d.creadoEn)
      const mes = meses.find((m) => m.clave === `${f.getFullYear()}-${f.getMonth()}`)
      if (mes) mes.total += 1
    })

    return {
      total: docs.length,
      totalVersiones: versiones.length,
      conVersiones: docs.filter((d) => (d.versiones?.length ?? 0) > 1).length,
      porInstitucion: agrupar(docs.map((d) => nombreInstitucion(d.institucionId))),
      porTipo: agrupar(docs.map((d) => d.tipo)),
      porFuncionario: agrupar(versiones.map((v) => v.subidoPor)),
      porMes: meses.map(({ nombre, total }) => ({ nombre, total })),
      recientes: [...docs].sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn)).slice(0, 5),
    }
  }, [documentos, institucionId])
}
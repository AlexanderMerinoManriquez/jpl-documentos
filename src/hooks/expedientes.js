import { useCallback, useEffect, useMemo, useState } from 'react'
import { expedientesApi } from '@/api/expedientes'
import { nombreInstitucion } from '@/lib/constantes'

export function useExpedientes(filtros) {
  const [expedientes, setExpedientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let vigente = true

    expedientesApi
      .buscar(filtros)
      .then((data) => {
        if (!vigente) return
        setExpedientes(data)
        setError(null)
      })
      .catch((err) => {
        if (!vigente) return
        setError(err.message ?? 'No se pudieron cargar los expedientes')
      })
      .finally(() => {
        if (vigente) setLoading(false)
      })

    return () => {
      vigente = false
    }
  }, [filtros])

  return { expedientes, loading, error }
}

export function useExpediente(id) {
  const [resultado, setResultado] = useState({ id: null, expediente: null, error: null })
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    let vigente = true

    expedientesApi
      .getById(id)
      .then((data) => {
        if (vigente) setResultado({ id, expediente: data ?? null, error: null })
      })
      .catch((err) => {
        if (vigente) setResultado({ id, expediente: null, error: err.message ?? 'No se pudo cargar el expediente' })
      })

    return () => {
      vigente = false
    }
  }, [id, recarga])

  const refetch = useCallback(() => setRecarga((n) => n + 1), [])

  const loading = resultado.id !== id

  return {
    expediente: loading ? null : resultado.expediente,
    loading,
    error: loading ? null : resultado.error,
    refetch,
  }
}

const MAX_MB = 25
const TIPOS_OK = ['application/pdf']


export function useSubirArchivo() {
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState(null)

  const validarArchivo = useCallback((archivo) => {
    if (!archivo) return null
    if (!TIPOS_OK.includes(archivo.type)) return 'Solo se permiten archivos PDF.'
    if (archivo.size > MAX_MB * 1024 * 1024) return `El archivo supera el máximo de ${MAX_MB} MB.`
    return null
  }, [])

  const ejecutar = useCallback(async (accion, archivo, mensajeError) => {
    const invalido = validarArchivo(archivo)
    if (invalido) {
      setError(invalido)
      return null
    }
    setSubiendo(true)
    setError(null)
    try {
      return await accion()
    } catch (err) {
      setError(err.message ?? mensajeError)
      return null
    } finally {
      setSubiendo(false)
    }
  }, [validarArchivo])

  const agregarDocumento = useCallback(
    (expedienteId, datos, archivo) =>
      ejecutar(() => expedientesApi.agregarDocumento(expedienteId, datos, archivo), archivo, 'No se pudo agregar el documento.'),
    [ejecutar]
  )

  const versionar = useCallback(
    (documentoId, motivo, archivo) =>
      ejecutar(() => expedientesApi.nuevaVersion(documentoId, motivo, archivo), archivo, 'No se pudo subir la nueva versión.'),
    [ejecutar]
  )

  return { agregarDocumento, versionar, validarArchivo, subiendo, error }
}

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
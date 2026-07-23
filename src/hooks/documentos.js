import { useCallback, useEffect, useState } from 'react'
import { documentosApi } from '@/api/documentos'

export function useDocumentos(filtros) {
  const [documentos, setDocumentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    let vigente = true

    documentosApi
      .buscar(filtros)
      .then((data) => {
        if (!vigente) return
        setDocumentos(data)
        setError(null)
      })
      .catch((err) => {
        if (!vigente) return
        setError(err.message ?? 'No se pudieron cargar los documentos')
      })
      .finally(() => {
        if (vigente) setLoading(false)
      })

    return () => {
      vigente = false
    }
  }, [filtros, recarga])

  const refetch = useCallback(() => {
    setLoading(true)
    setRecarga((n) => n + 1)
  }, [])

  return { documentos, loading, error, refetch }
}

export function useDocumento(id) {
  const [resultado, setResultado] = useState({ id: null, documento: null, error: null })
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    let vigente = true

    documentosApi
      .getById(id)
      .then((data) => {
        if (vigente) setResultado({ id, documento: data ?? null, error: null })
      })
      .catch((err) => {
        if (vigente) setResultado({ id, documento: null, error: err.message ?? 'No se pudo cargar el documento' })
      })

    return () => {
      vigente = false
    }
  }, [id, recarga])

  const refetch = useCallback(() => setRecarga((n) => n + 1), [])

  const loading = resultado.id !== id

  return {
    documento: loading ? null : resultado.documento,
    loading,
    error: loading ? null : resultado.error,
    refetch,
  }
}

const MAX_MB = 25
const TIPOS_OK = ['application/pdf']

export function useSubirDocumento() {
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

  const crear = useCallback(
    (datos, archivo) =>
      ejecutar(() => documentosApi.crear(datos, archivo), archivo, 'No se pudo subir el documento.'),
    [ejecutar]
  )

  const versionar = useCallback(
    (id, motivo, archivo) =>
      ejecutar(() => documentosApi.nuevaVersion(id, motivo, archivo), archivo, 'No se pudo subir la nueva versión.'),
    [ejecutar]
  )

  return { crear, versionar, validarArchivo, subiendo, error }
}
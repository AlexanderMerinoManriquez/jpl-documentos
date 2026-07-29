import { useCallback, useEffect, useState } from 'react'
import { expedientesApi } from '@/api/expedientes'
import { ROL_REGEX } from '@/lib/constantes'

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

  const agregarDocumento = useCallback(
    async (expedienteId, datos, archivo) => {
      const invalido = validarArchivo(archivo)
      if (invalido) {
        setError(invalido)
        return null
      }
      setSubiendo(true)
      setError(null)
      try {
        return await expedientesApi.agregarDocumento(expedienteId, datos, archivo)
      } catch (err) {
        setError(err.message ?? 'No se pudo agregar el documento.')
        return null
      } finally {
        setSubiendo(false)
      }
    },
    [validarArchivo]
  )

  return { agregarDocumento, validarArchivo, subiendo, error }
}

export function useBusquedaPublica(institucionInicial = '') {
  const [institucionId, setInstitucionId] = useState(institucionInicial)
  const [codigo, setCodigo] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState(null)
  const [sinResultado, setSinResultado] = useState(false)

  const limpiarAvisos = () => {
    setError(null)
    setSinResultado(false)
  }

  const escribir = (e) => {
    setCodigo(e.target.value)
    limpiarAvisos()
  }

  const cambiarInstitucion = (id) => {
    setInstitucionId(id)
    limpiarAvisos()
  }

  const buscar = async (e) => {
    e.preventDefault()
    const limpio = codigo.trim()
    if (!ROL_REGEX.test(limpio)) {
      setError('Ingresa el ROL con el formato número-año. Ej: 1234-2026')
      return null
    }
    setBuscando(true)
    limpiarAvisos()
    try {
      const data = await expedientesApi.consultaPublica(limpio, institucionId)
      if (data.length > 0) return data[0]
      setSinResultado(true)
      return null
    } catch {
      setError('No se pudo realizar la consulta. Intenta nuevamente.')
      return null
    } finally {
      setBuscando(false)
    }
  }

  return { codigo, institucionId, buscando, error, sinResultado, escribir, cambiarInstitucion, buscar }
}
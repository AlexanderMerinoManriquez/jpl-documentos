import { useCallback, useEffect, useState } from 'react'
import { expedientesApi } from '@/api/expedientes'
import { ROL_REGEX } from '@/lib/constantes'

export function useExpediente(id) {
  const [estado, setEstado] = useState({ cargando: true, expediente: null, error: null })
  const [recarga, setRecarga] = useState(0)

  const [idActual, setIdActual] = useState(id)
  if (id !== idActual) {
    setIdActual(id)
    setEstado({ cargando: true, expediente: null, error: null })
  }

  useEffect(() => {
    let vigente = true

    expedientesApi
      .getById(id)
      .then((data) => {
        if (vigente) setEstado({ cargando: false, expediente: data ?? null, error: null })
      })
      .catch((err) => {
        if (vigente) setEstado({ cargando: false, expediente: null, error: err.message ?? 'No se pudo cargar el expediente' })
      })

    return () => {
      vigente = false
    }
  }, [id, recarga])

  const refetch = useCallback(() => setRecarga((n) => n + 1), [])

  return {
    expediente: estado.expediente,
    loading: estado.cargando,
    error: estado.error,
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

export function useBusquedaPublica(departamentoInicial = '') {
  const [departamentoId, setDepartamentoId] = useState(departamentoInicial)
  const [rol, setRol] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState(null)
  const [sinResultado, setSinResultado] = useState(false)

  const limpiarAvisos = () => {
    setError(null)
    setSinResultado(false)
  }

  const escribir = (e) => {
    setRol(e.target.value)
    limpiarAvisos()
  }

  const cambiarDepartamento = (id) => {
    setDepartamentoId(id)
    limpiarAvisos()
  }

  const buscar = async (e) => {
    e.preventDefault()
    const limpio = rol.trim()
    if (!ROL_REGEX.test(limpio)) {
      setError('Ingresa el ROL con el formato número-año. Ej: 1234-2026')
      return null
    }
    setBuscando(true)
    limpiarAvisos()
    try {
      const data = await expedientesApi.consultaPublica(limpio, departamentoId)
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

  return { rol, departamentoId, buscando, error, sinResultado, escribir, cambiarDepartamento, buscar }
}
export function useUnificarPdf() {
  const [generando, setGenerando] = useState(false)
  const [progreso, setProgreso] = useState(null)
  const [error, setError] = useState(null)

  const unificar = useCallback(async (expediente) => {
    const documentos = expediente?.documentos ?? []
    if (documentos.length === 0) return
    setGenerando(true)
    setProgreso({ actual: 0, total: documentos.length })
    setError(null)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const combinado = await PDFDocument.create()

      for (const [i, doc] of documentos.entries()) {
        setProgreso({ actual: i + 1, total: documentos.length })
        const bytes = await fetch(doc.url).then((r) => {
          if (!r.ok) throw new Error(`No se pudo leer ${doc.nombre}`)
          return r.arrayBuffer()
        })
        const pdf = await PDFDocument.load(bytes)
        const paginas = await combinado.copyPages(pdf, pdf.getPageIndices())
        paginas.forEach((p) => combinado.addPage(p))
      }

      const salida = await combinado.save()
      const blob = new Blob([salida], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const enlace = document.createElement('a')
      enlace.href = url
      enlace.download = `Expediente ${expediente.rol}.pdf`
      enlace.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message ?? 'No se pudo unificar el expediente.')
    } finally {
      setGenerando(false)
      setProgreso(null)
    }
  }, [])

  return { unificar, generando, progreso, error }
}

export function useRecientes() {
  const [estado, setEstado] = useState({ cargando: true, recientes: [], error: null })

  useEffect(() => {
    let vigente = true

    expedientesApi
      .recientes()
      .then((data) => {
        if (vigente) setEstado({ cargando: false, recientes: data ?? [], error: null })
      })
      .catch(() => {
        if (vigente) setEstado({ cargando: false, recientes: [], error: 'No se pudieron cargar las causas recientes.' })
      })

    return () => {
      vigente = false
    }
  }, [])

  return estado
}

export function useEstadisticas() {
  const [estado, setEstado] = useState({ cargando: true, datos: null, error: null })

  useEffect(() => {
    let vigente = true

    expedientesApi
      .estadisticas()
      .then((data) => {
        if (vigente) setEstado({ cargando: false, datos: data ?? null, error: null })
      })
      .catch(() => {
        if (vigente) setEstado({ cargando: false, datos: null, error: 'No se pudieron cargar las estadísticas.' })
      })

    return () => {
      vigente = false
    }
  }, [])

  return estado
}
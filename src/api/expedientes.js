import axiosClient from './axiosClient'
import { mockExpedientes } from '@/mocks/expedientes'

const MOCK = import.meta.env.VITE_USE_MOCKS === 'true'

export const expedientesApi = {

  getById: (id) =>
    MOCK
      ? Promise.resolve(mockExpedientes.find((e) => e.id === Number(id)))
      : axiosClient.get(`/expedientes/${id}`),

  consultaPublica: (rol, departamentoId) => {
    if (MOCK) {
      const q = rol.trim().toLowerCase()
      return Promise.resolve(
        mockExpedientes.filter(
          (e) => e.rol.toLowerCase() === q && e.departamentoId === departamentoId
        )
      )
    }
    return axiosClient.get('/publico/expedientes', { params: { rol, departamentoId } })
  },

  crear: (datos) => {
    if (MOCK) {
      const nuevo = {
        id: Date.now(),
        ...datos,
        creadoEn: new Date().toISOString(),
        documentos: [],
      }
      mockExpedientes.push(nuevo)
      return Promise.resolve(nuevo)
    }
    return axiosClient.post('/expedientes', datos)
  },

  recientes: () =>
    MOCK
      ? Promise.resolve([...mockExpedientes].reverse().slice(0, 5).map(({ id, rol, caratula }) => ({ id, rol, caratula })))
      : axiosClient.get('/expedientes/recientes'),

  estadisticas: () => {
    if (MOCK) {
      const porEstado = {}
      const porMesMap = {}
      mockExpedientes.forEach((e) => {
        const estado = e.estado ?? 'sin_estado'
        porEstado[estado] = (porEstado[estado] ?? 0) + 1
        const mes = (e.creadoEn ?? '').slice(0, 7)
        if (mes) {
          porMesMap[mes] ??= {}
          porMesMap[mes][estado] = (porMesMap[mes][estado] ?? 0) + 1
        }
      })
      const porMes = Object.entries(porMesMap)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([mes, estados]) => ({ mes, estados }))
      return Promise.resolve({ total: mockExpedientes.length, porEstado, porMes })
    }
    return axiosClient.get('/estadisticas')
  },

  eliminarDocumento: (documentoId) => {
    if (MOCK) {
      for (const exp of mockExpedientes) {
        const i = exp.documentos?.findIndex((d) => d.id === documentoId) ?? -1
        if (i >= 0) {
          exp.documentos.splice(i, 1)
          break
        }
      }
      return Promise.resolve(true)
    }
    return axiosClient.delete(`/documentos/${documentoId}`)
  },

  agregarDocumento: (expedienteId, datos, archivo) => {
    const form = new FormData()
    form.append('archivo', archivo)
    Object.entries(datos).forEach(([k, v]) => {
      if (v) form.append(k, v)
    })
    return axiosClient.post(`/expedientes/${expedienteId}/documentos`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
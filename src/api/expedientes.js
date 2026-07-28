import axiosClient from './axiosClient'
import { mockExpedientes } from '@/mocks/expedientes'

const MOCK = import.meta.env.VITE_USE_MOCKS === 'true'

export const expedientesApi = {
  buscar: (filtros) =>
    MOCK
      ? Promise.resolve(mockExpedientes)
      : axiosClient.get('/expedientes', { params: filtros }),

  getById: (id) =>
    MOCK
      ? Promise.resolve(mockExpedientes.find((e) => e.id === Number(id)))
      : axiosClient.get(`/expedientes/${id}`),

  consultaPublica: (codigo, institucionId) => {
    if (MOCK) {
      const q = codigo.trim().toLowerCase()
      return Promise.resolve(
        mockExpedientes.filter(
          (e) => e.codigo.toLowerCase() === q && e.institucionId === institucionId
        )
      )
    }
    return axiosClient.get('/publico/expedientes', { params: { codigo, institucionId } })
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

  nuevaVersion: (documentoId, motivo, archivo) => {
    const form = new FormData()
    form.append('archivo', archivo)
    form.append('motivo', motivo)
    return axiosClient.post(`/documentos/${documentoId}/versiones`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
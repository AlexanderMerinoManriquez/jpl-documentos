import axiosClient from './axiosClient'
import { mockDocumentos } from '@/mocks/documentos'

const MOCK = import.meta.env.VITE_USE_MOCKS === 'true'

export const documentosApi = {
  buscar: (filtros) =>
    MOCK
      ? Promise.resolve(mockDocumentos)
      : axiosClient.get('/documentos', { params: filtros }),

  getById: (id) =>
    MOCK
      ? Promise.resolve(mockDocumentos.find((d) => d.id === Number(id)))
      : axiosClient.get(`/documentos/${id}`),

  crear: (datos, archivo) => {
    const form = new FormData()
    form.append('archivo', archivo)
    Object.entries(datos).forEach(([k, v]) => {
      if (v) form.append(k, v)
    })
    return axiosClient.post('/documentos', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  nuevaVersion: (id, motivo, archivo) => {
    const form = new FormData()
    form.append('archivo', archivo)
    form.append('motivo', motivo)
    return axiosClient.post(`/documentos/${id}/versiones`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  consultaPublica: (rol, institucion) => {
    if (MOCK) {
      const q = rol.trim().toLowerCase()
      return Promise.resolve(
        mockDocumentos.filter(
          (d) => d.rol.toLowerCase() === q && (!institucion || d.institucion === institucion)
        )
      )
    }
    return axiosClient.get('/publico/documentos', { params: { rol, institucion } })
  },
}
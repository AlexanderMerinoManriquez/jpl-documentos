export const RUTAS = {
  inicio: '/',
  expediente: (id) => `/expedientes/${id}`,
  documento: (expedienteId, documentoId) => `/expedientes/${expedienteId}/documentos/${documentoId}`,
  estadisticas: '/estadisticas',
  expedientePatron: '/expedientes/:id',
  documentoPatron: '/expedientes/:id/documentos/:docId',
}
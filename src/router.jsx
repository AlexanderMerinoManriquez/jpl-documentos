import { createBrowserRouter, Navigate } from 'react-router-dom'
import Inicio from '@/pages/Inicio'
import ExpedienteDetalle from '@/pages/ExpedienteDetalle'
import DocumentoDetalle from '@/pages/DocumentoDetalle'
import Estadisticas from '@/pages/Estadisticas'
import { RUTAS } from '@/lib/rutas'

export const router = createBrowserRouter([
  { path: RUTAS.inicio, element: <Inicio /> },
  { path: RUTAS.expedientePatron, element: <ExpedienteDetalle /> },
  { path: RUTAS.documentoPatron, element: <DocumentoDetalle /> },
  { path: RUTAS.estadisticas, element: <Estadisticas /> },
  { path: '*', element: <Navigate to={RUTAS.inicio} replace /> },
])
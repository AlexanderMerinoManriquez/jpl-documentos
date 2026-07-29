import { createBrowserRouter, Navigate } from 'react-router-dom'
import PublicoConsulta from '@/pages/PublicoConsulta'
import ExpedienteDetalle from '@/pages/ExpedienteDetalle'
 
export const router = createBrowserRouter([
  { path: '/', element: <PublicoConsulta /> },
  { path: '/expedientes/:id', element: <ExpedienteDetalle /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Inicio from '@/pages/Inicio'
import ExpedienteDetalle from '@/pages/ExpedienteDetalle'
import { RUTAS } from '@/lib/rutas'
 
export const router = createBrowserRouter([
  { path: RUTAS.inicio, element: <Inicio /> },
  { path: RUTAS.expedientePatron, element: <ExpedienteDetalle /> },
  { path: '*', element: <Navigate to={RUTAS.inicio} replace /> },
])
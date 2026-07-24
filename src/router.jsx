import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import PublicoConsulta from '@/pages/PublicoConsulta'
import Expedientes from '@/pages/Expedientes'
import ExpedienteDetalle from '@/pages/ExpedienteDetalle'
import ExpedienteNuevo from '@/pages/ExpedienteNuevo'
import Estadisticas from '@/pages/Estadisticas'

export const router = createBrowserRouter([
  { path: '/consulta', element: <PublicoConsulta /> },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/expedientes" replace /> },
      { path: 'expedientes', element: <Expedientes /> },
      { path: 'expedientes/nuevo', element: <ExpedienteNuevo /> },
      { path: 'expedientes/:id', element: <ExpedienteDetalle /> },
      { path: 'estadisticas', element: <Estadisticas /> },
    ],
  },
])
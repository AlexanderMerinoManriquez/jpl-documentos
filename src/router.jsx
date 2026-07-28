import { createBrowserRouter, Navigate } from 'react-router-dom'
import PublicoConsulta from '@/pages/PublicoConsulta'
import ExpedienteDetalle from '@/pages/ExpedienteDetalle'
import Layout from '@/components/Layout'
import Expedientes from '@/pages/Expedientes'
import ExpedienteNuevo from '@/pages/ExpedienteNuevo'
import Estadisticas from '@/pages/Estadisticas'

export const router = createBrowserRouter([
  { path: '/', element: <PublicoConsulta /> },
  { path: '/expedientes/:id', element: <ExpedienteDetalle /> },
  {
    path: '/panel',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/panel/expedientes" replace /> },
      { path: 'expedientes', element: <Expedientes /> },
      { path: 'expedientes/nuevo', element: <ExpedienteNuevo /> },
      { path: 'estadisticas', element: <Estadisticas /> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
])
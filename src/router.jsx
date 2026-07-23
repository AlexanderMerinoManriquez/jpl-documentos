import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import Documentos from '@/pages/Documentos'
import DocumentoDetalle from '@/pages/DocumentoDetalle'
import DocumentoNuevo from '@/pages/DocumentoNuevo'
import Estadisticas from '@/pages/Estadisticas'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/documentos" replace /> },
      { path: 'documentos', element: <Documentos /> },
      { path: 'documentos/nuevo', element: <DocumentoNuevo /> },
      { path: 'documentos/:id', element: <DocumentoDetalle /> },
      { path: 'estadisticas', element: <Estadisticas /> },
    ],
  },
])
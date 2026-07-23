import { useMemo, useState } from 'react'
import { Eye, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import Boton from '@/components/Boton'
import Paginacion from '@/components/Paginacion'
import SelectorInstitucion from '@/components/SelectorInstitucion'
import { useDocumentos } from '@/hooks/documentos'
import { ETIQUETA_CODIGO_POR_DEFECTO, INSTITUCIONES, nombreInstitucion } from '@/lib/constantes'
import { fechaUltimaActualizacion, formatearFecha } from '@/lib/documentos'
import { usarSesion } from '@/lib/sesion'
import { CAMPO } from '@/lib/estilos'

const POR_PAGINA = 15
const TH = 'px-4 py-4 text-sm font-semibold'
const TD = 'px-4 py-4 text-slate-700'

export default function Documentos() {
  const { documentos, loading, error } = useDocumentos()
  const { permisos, institucionFija } = usarSesion()
  const [busqueda, setBusqueda] = useState('')
  const [seleccion, setSeleccion] = useState('')
  const [pagina, setPagina] = useState(1)

  const institucion = institucionFija || seleccion

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()

    return documentos.filter((doc) => {
      if (institucion && doc.institucionId !== institucion) return false
      if (!q) return true
      return doc.codigo?.toLowerCase().includes(q)
    })
  }, [documentos, busqueda, institucion])

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA)
  const paginaActual = Math.min(pagina, totalPaginas || 1)
  const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  if (loading) return <p className="text-sm text-slate-500">Cargando documentos…</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md lg:p-6">
      <h2 className="text-2xl font-semibold text-slate-900 lg:text-3xl">Documentos</h2>
      <p className="mt-1 text-sm text-slate-500">{filtrados.length} de {documentos.length} registros</p>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:w-105">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }} placeholder={`Buscar por ${ETIQUETA_CODIGO_POR_DEFECTO.toLowerCase()} o ROL`} className={`${CAMPO} pl-11`} />
        </div>

        {permisos.todasInstituciones && (
          <SelectorInstitucion value={seleccion} opciones={INSTITUCIONES} onSeleccionar={(v) => { setSeleccion(v); setPagina(1) }} className="lg:w-64" />
        )}

        {permisos.digitalizar && <Boton to="/documentos/nuevo" className="shrink-0 lg:ml-auto">Digitalizar</Boton>}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-[15px]">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className={TH}>Código</th>
                <th className={TH}>Tipo</th>
                <th className={TH}>Nombre</th>
                <th className={TH}>Institución</th>
                <th className={TH}>Última actualización</th>
                <th className={`${TH} text-center`}>Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {visibles.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-blue-600">{doc.codigo}</td>
                  <td className={TD}>{doc.tipo}</td>
                  <td className={TD}>{doc.nombre}</td>
                  <td className={TD}>{nombreInstitucion(doc.institucionId)}</td>
                  <td className={TD}>{formatearFecha(fechaUltimaActualizacion(doc), true)}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <Link to={`/documentos/${doc.id}`} title="Ver documento" className="rounded-lg p-2.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600">
                        <Eye size={20} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtrados.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-slate-500">
            {busqueda || institucion ? 'No se encontraron documentos con ese criterio.' : 'No hay documentos registrados.'}
          </p>
        )}
      </div>

      <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </div>
  )
}
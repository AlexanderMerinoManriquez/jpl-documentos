import { useMemo, useState } from 'react'
import { Eye, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import Boton from '@/components/Boton'
import Paginacion from '@/components/Paginacion'
import SelectorInstitucion from '@/components/SelectorInstitucion'
import { useExpedientes } from '@/hooks/expedientes'
import { etiquetaCodigoActiva, INSTITUCIONES, nombreInstitucion } from '@/lib/constantes'
import { formatearFecha, totalDocumentos, ultimoMovimiento } from '@/lib/expedientes'
import { useSesion } from '@/lib/sesion'
import { CAMPO } from '@/lib/estilos'

const POR_PAGINA = 15
const TH = 'px-4 py-4 text-sm font-semibold'
const TD = 'px-4 py-4 text-slate-700'

export default function Expedientes() {
  const { expedientes, loading, error } = useExpedientes()
  const { permisos, institucionFija } = useSesion()
  const [busqueda, setBusqueda] = useState('')
  const [seleccion, setSeleccion] = useState('')
  const [pagina, setPagina] = useState(1)

  const institucion = institucionFija || seleccion
  const etiqueta = etiquetaCodigoActiva(institucion)
  const consulta = busqueda.trim().toLowerCase()

  const resultados = useMemo(() => {
    if (!permisos.verLista) {
      if (!consulta) return []
      return expedientes.filter((e) => e.codigo?.toLowerCase() === consulta)
    }

    return expedientes.filter((exp) => {
      if (institucion && exp.institucionId !== institucion) return false
      if (!consulta) return true
      return exp.codigo?.toLowerCase().includes(consulta)
    })
  }, [expedientes, consulta, institucion, permisos.verLista])

  const totalPaginas = Math.ceil(resultados.length / POR_PAGINA)
  const paginaActual = Math.min(pagina, totalPaginas || 1)
  const visibles = resultados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  if (loading) return <p className="text-sm text-slate-500">Cargando expedientes…</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md lg:p-6">
      <h2 className="text-2xl font-semibold text-slate-900 lg:text-3xl">Expedientes</h2>
      {permisos.verLista ? (
        <p className="mt-1 text-sm text-slate-500">{resultados.length} de {expedientes.length} causas</p>
      ) : (
        <p className="mt-1 text-sm text-slate-500">Ingresa el {etiqueta} para consultar una causa.</p>
      )}

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:w-105">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }} placeholder={`Buscar por ${etiqueta}`} className={`${CAMPO} pl-11`} />
        </div>

        {permisos.todasInstituciones && (
          <SelectorInstitucion value={seleccion} opciones={INSTITUCIONES} onSeleccionar={(v) => { setSeleccion(v); setPagina(1) }} className="lg:w-64" />
        )}

        {permisos.digitalizar && <Boton to="/expedientes/nuevo" className="shrink-0 lg:ml-auto">Nuevo expediente</Boton>}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-[15px]">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className={TH}>{etiqueta}</th>
                <th className={TH}>Carátula</th>
                <th className={TH}>Institución</th>
                <th className={`${TH} text-center`}>Documentos</th>
                <th className={TH}>Último movimiento</th>
                <th className={`${TH} text-center`}>Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {visibles.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-blue-600">{exp.codigo}</td>
                  <td className={TD}>{exp.caratula}</td>
                  <td className={TD}>{nombreInstitucion(exp.institucionId)}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{totalDocumentos(exp)}</span>
                  </td>
                  <td className={TD}>{formatearFecha(ultimoMovimiento(exp), true)}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <Link to={`/expedientes/${exp.id}`} title="Ver expediente" className="rounded-lg p-2.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600">
                        <Eye size={20} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {resultados.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-slate-500">
            {!permisos.verLista && !consulta
              ? `Escribe un ${etiqueta.toLowerCase()} en el buscador para ver la causa.`
              : consulta || institucion
                ? 'No se encontraron expedientes con ese criterio.'
                : 'No hay expedientes registrados.'}
          </p>
        )}
      </div>

      <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </div>
  )
}
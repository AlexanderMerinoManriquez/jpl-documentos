import { useMemo, useState } from 'react'
import { Eye, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDocumentos } from '@/hooks/documentos'
import { formatearFecha } from '@/lib/documentos'
import { REMITENTES } from '@/lib/constantes'

export default function Documentos() {
  const { documentos, loading, error } = useDocumentos()
  const [busqueda, setBusqueda] = useState('')
  const [remitente, setRemitente] = useState('')

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()

    return documentos.filter((doc) => {
      if (remitente && doc.remitente !== remitente) return false
      if (!q) return true

      return [doc.rol, doc.nombre, doc.remitente, doc.tipo]
        .filter(Boolean)
        .some((campo) => campo.toLowerCase().includes(q))
    })
  }, [documentos, busqueda, remitente])

  if (loading) return <p className="text-sm text-slate-500">Cargando documentos…</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold text-slate-900">Documentos</h2>
      <p className="mt-1 text-sm text-slate-500">{filtrados.length} de {documentos.length} registros</p>

      <div className="mt-5 flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por ROL, nombre o remitente" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>

        <select value={remitente} onChange={(e) => setRemitente(e.target.value)} className="w-72 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
          <option value="">Todos los remitentes</option>
          {REMITENTES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        <Link to="/documentos/nuevo" className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          Digitalizar
        </Link>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">ROL</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Remitente</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 text-center font-medium">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filtrados.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-blue-600">{doc.rol}</td>
                <td className="px-4 py-3 text-slate-700">{doc.tipo}</td>
                <td className="px-4 py-3 text-slate-700">{doc.nombre}</td>
                <td className="px-4 py-3 text-slate-700">{doc.remitente}</td>
                <td className="px-4 py-3 text-slate-700">{formatearFecha(doc.fechaDocumento)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <Link to={`/documentos/${doc.id}`} title="Ver documento" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600">
                      <Eye size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtrados.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-slate-500">
            {busqueda || remitente ? 'No se encontraron documentos con ese criterio.' : 'No hay documentos registrados.'}
          </p>
        )}
      </div>
    </div>
  )
}
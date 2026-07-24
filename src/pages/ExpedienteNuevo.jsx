import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Boton from '@/components/Boton'
import SelectorInstitucion from '@/components/SelectorInstitucion'
import { expedientesApi } from '@/api/expedientes'
import { CAMPO, etiquetaCodigo, INSTITUCIONES } from '@/lib/constantes'
import { useSesion } from '@/lib/sesion'

const INICIAL = { codigo: '', caratula: '', institucionId: '' }

export default function ExpedienteNuevo() {
  const navigate = useNavigate()
  const { permisos, institucionFija } = useSesion()
  const [form, setForm] = useState({ ...INICIAL, institucionId: institucionFija })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })
  const etiqueta = etiquetaCodigo(form.institucionId)
  const completo = form.codigo.trim() && form.caratula.trim() && form.institucionId

  const enviar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      const exp = await expedientesApi.crear(form)
      navigate(`/expedientes/${exp.id}`)
    } catch (err) {
      setError(err.message ?? 'No se pudo crear el expediente.')
    } finally {
      setGuardando(false)
    }
  }

  if (!permisos.digitalizar) {
    return <p className="text-sm text-slate-500">No tienes permisos para crear expedientes.</p>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/expedientes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800">
        <ArrowLeft size={16} />
        Volver a expedientes
      </Link>

      <form onSubmit={enviar} className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-md lg:p-6">
        <h2 className="text-2xl font-semibold text-slate-900 lg:text-3xl">Nuevo expediente</h2>
        <p className="mt-1 text-sm text-slate-500">Registra la causa. Luego podrás agregarle los documentos digitalizados.</p>

        <div className="mt-6 space-y-4">
          <Campo label="Institución" requerido>
            <SelectorInstitucion value={form.institucionId} opciones={INSTITUCIONES} onSeleccionar={(v) => setForm({ ...form, institucionId: v })} placeholder="Seleccionar institución…" conTodas={false} />
          </Campo>

          <Campo label={etiqueta} requerido>
            <input value={form.codigo} onChange={set('codigo')} placeholder="C-1234-2026" className={CAMPO} />
          </Campo>

          <Campo label="Carátula" requerido>
            <input value={form.caratula} onChange={set('caratula')} placeholder="Ej: Municipalidad de Chillán con Pérez" className={CAMPO} />
          </Campo>
        </div>

        {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Boton type="submit" disabled={!completo || guardando}>
            {guardando ? 'Creando…' : 'Crear expediente'}
          </Boton>
          <Boton type="button" variante="secundario" onClick={() => navigate('/expedientes')}>
            Cancelar
          </Boton>
        </div>
      </form>
    </div>
  )
}

function Campo({ label, requerido, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {requerido && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  )
}
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Boton from '@/components/Boton'
import SelectorArchivo from '@/components/SelectorArchivo'
import SelectorInstitucion from '@/components/SelectorInstitucion'
import { useSubirDocumento } from '@/hooks/documentos'
import { etiquetaCodigo, INSTITUCIONES, TIPOS } from '@/lib/constantes'
import { usarSesion } from '@/lib/sesion'
import { CAMPO } from '@/lib/estilos'

const INICIAL = { codigo: '', tipo: '', nombre: '', institucionId: '', observaciones: '' }

export default function DocumentoNuevo() {
  const navigate = useNavigate()
  const { permisos, institucionFija } = usarSesion()
  const [form, setForm] = useState({ ...INICIAL, institucionId: institucionFija })
  const [archivo, setArchivo] = useState(null)
  const { crear, validarArchivo, subiendo, error } = useSubirDocumento()

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })
  const errorArchivo = validarArchivo(archivo)
  const etiqueta = etiquetaCodigo(form.institucionId)

  const completo = archivo && !errorArchivo && form.codigo && form.tipo && form.nombre && form.institucionId

  const enviar = async (e) => {
    e.preventDefault()
    const doc = await crear(form, archivo)
    if (doc) navigate(`/documentos/${doc.id}`)
  }

  if (!permisos.digitalizar) {
    return <p className="text-sm text-slate-500">No tienes permisos para digitalizar documentos.</p>
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/documentos" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800">
        <ArrowLeft size={16} />
        Volver a documentos
      </Link>

      <form onSubmit={enviar} className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-md lg:p-6">
        <h2 className="text-2xl font-semibold text-slate-900 lg:text-3xl">Digitalizar documento</h2>
        <p className="mt-1 text-sm text-slate-500">Sube el escaneo del documento físico y registra sus datos. La fecha de ingreso se registra automáticamente.</p>

        <div className="mt-6">
          <SelectorArchivo archivo={archivo} onSeleccionar={setArchivo} error={errorArchivo} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <Campo label="Institución" requerido>
              <SelectorInstitucion value={form.institucionId} opciones={INSTITUCIONES} onSeleccionar={(v) => setForm({ ...form, institucionId: v })} placeholder="Seleccionar institución…" conTodas={false} />
            </Campo>
          </div>

          <Campo label={etiqueta} requerido>
            <input value={form.codigo} onChange={set('codigo')} placeholder="C-1234-2026" className={CAMPO} />
          </Campo>

          <Campo label="Tipo de documento" requerido>
            <select value={form.tipo} onChange={set('tipo')} className={`${CAMPO} cursor-pointer`}>
              <option value="">Seleccionar…</option>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Campo>

          <div className="lg:col-span-2">
            <Campo label="Nombre o materia" requerido>
              <input value={form.nombre} onChange={set('nombre')} placeholder="Descripción breve del documento" className={CAMPO} />
            </Campo>
          </div>

          <div className="lg:col-span-2">
            <Campo label="Observaciones">
              <textarea rows={3} value={form.observaciones} onChange={set('observaciones')} className={CAMPO} />
            </Campo>
          </div>
        </div>

        {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Boton type="submit" disabled={!completo || subiendo}>
            {subiendo ? 'Subiendo…' : 'Digitalizar documento'}
          </Boton>
          <Boton type="button" variante="secundario" onClick={() => navigate('/documentos')}>
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
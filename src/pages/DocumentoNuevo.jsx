import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import CampoFecha from '@/components/CampoFecha'
import SelectorArchivo from '@/components/SelectorArchivo'
import { useSubirDocumento } from '@/hooks/documentos'
import { REMITENTES, TIPOS } from '@/lib/constantes'

const INICIAL = { rol: '', tipo: '', nombre: '', remitente: '', fechaDocumento: '', observaciones: '' }

const CAMPO = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

export default function DocumentoNuevo() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INICIAL)
  const [archivo, setArchivo] = useState(null)
  const { crear, validarArchivo, subiendo, error } = useSubirDocumento()

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })
  const errorArchivo = validarArchivo(archivo)

  const completo = archivo && !errorArchivo && form.rol && form.tipo && form.nombre && form.remitente && form.fechaDocumento

  const enviar = async (e) => {
    e.preventDefault()
    const doc = await crear(form, archivo)
    if (doc) navigate(`/documentos/${doc.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/documentos" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800">
        <ArrowLeft size={16} />
        Volver a documentos
      </Link>

      <form onSubmit={enviar} className="mt-3 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Digitalizar documento</h2>
        <p className="mt-1 text-sm text-slate-500">Sube el escaneo del documento físico y registra sus datos.</p>

        <div className="mt-6">
          <SelectorArchivo archivo={archivo} onSeleccionar={setArchivo} error={errorArchivo} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Campo label="ROL" requerido>
            <input value={form.rol} onChange={set('rol')} placeholder="C-1234-2026" className={CAMPO} />
          </Campo>

          <Campo label="Tipo de documento" requerido>
            <select value={form.tipo} onChange={set('tipo')} className={CAMPO}>
              <option value="">Seleccionar…</option>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Campo>

          <Campo label="Remitente" requerido>
            <select value={form.remitente} onChange={set('remitente')} className={CAMPO}>
              <option value="">Seleccionar…</option>
              {REMITENTES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Campo>

          <Campo label="Fecha del documento" requerido>
            <CampoFecha value={form.fechaDocumento} onChange={(iso) => setForm({ ...form, fechaDocumento: iso })} />
          </Campo>

          <div className="col-span-2">
            <Campo label="Nombre o materia" requerido>
              <input value={form.nombre} onChange={set('nombre')} placeholder="Descripción breve del documento" className={CAMPO} />
            </Campo>
          </div>

          <div className="col-span-2">
            <Campo label="Observaciones">
              <textarea rows={3} value={form.observaciones} onChange={set('observaciones')} className={CAMPO} />
            </Campo>
          </div>
        </div>

        {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={!completo || subiendo} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
            {subiendo ? 'Subiendo…' : 'Digitalizar documento'}
          </button>
          <button type="button" onClick={() => navigate('/documentos')} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50">
            Cancelar
          </button>
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
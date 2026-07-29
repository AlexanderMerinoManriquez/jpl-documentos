import { useState } from 'react'
import Boton from '@/components/Boton'
import Modal from '@/components/Modal'
import SelectorInstitucion from '@/components/SelectorInstitucion'
import { expedientesApi } from '@/api/expedientes'
import { CAMPO, etiquetaCodigo, INSTITUCIONES } from '@/lib/constantes'

const INICIAL = { codigo: '', caratula: '', institucionId: '' }

export default function ModalNuevoExpediente({ abierto, institucionFija = '', codigoInicial = '', onCerrar, onCreado }) {
  const [form, setForm] = useState({ ...INICIAL, institucionId: institucionFija, codigo: codigoInicial })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })
  const etiqueta = etiquetaCodigo(form.institucionId)
  const completo = form.codigo.trim() && form.caratula.trim() && form.institucionId

  const cerrar = () => {
    setForm({ ...INICIAL, institucionId: institucionFija })
    setError(null)
    onCerrar()
  }

  const enviar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      const exp = await expedientesApi.crear(form)
      onCreado(exp)
    } catch (err) {
      setError(err.message ?? 'No se pudo crear el expediente.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal abierto={abierto} titulo="Nueva Causa" onCerrar={cerrar}>
      <form onSubmit={enviar}>
        <p className="text-sm text-slate-500">Registra la causa. Luego podrás agregarle los documentos digitalizados.</p>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Departamento<span className="text-red-500">*</span></span>
          <SelectorInstitucion value={form.institucionId} opciones={INSTITUCIONES} onSeleccionar={(v) => setForm({ ...form, institucionId: v })} placeholder="Seleccionar institución…" />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">{etiqueta} <span className="text-red-500">*</span></span>
          <input value={form.codigo} onChange={set('codigo')} placeholder="1234-2026" className={CAMPO} />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Carátula <span className="text-red-500">*</span></span>
          <input value={form.caratula} onChange={set('caratula')} placeholder="Ej: Municipalidad de Chillán con Pérez" className={CAMPO} />
        </label>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-5 flex justify-end gap-3">
          <Boton type="button" variante="secundario" onClick={cerrar}>Cancelar</Boton>
          <Boton type="submit" disabled={!completo || guardando}>
            {guardando ? 'Creando…' : 'Crear expediente'}
          </Boton>
        </div>
      </form>
    </Modal>
  )
}
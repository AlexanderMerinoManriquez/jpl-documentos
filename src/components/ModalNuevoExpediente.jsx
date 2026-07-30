import { useState } from 'react'
import Boton from '@/components/Boton'
import Modal from '@/components/Modal'
import SelectorDepartamento from '@/components/SelectorDepartamento'
import { expedientesApi } from '@/api/expedientes'
import { CAMPO, DEPARTAMENTOS, ROL_REGEX } from '@/lib/constantes'

const INICIAL = { rol: '', caratula: '', departamentoId: '' }

export default function ModalNuevoExpediente({ abierto, departamentoFijo = '', rolInicial = '', onCerrar, onCreado }) {
  const [form, setForm] = useState({ ...INICIAL, departamentoId: departamentoFijo, rol: rolInicial })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })
  const completo = form.rol.trim() && form.caratula.trim() && form.departamentoId

  const cerrar = () => {
    setForm({ ...INICIAL, departamentoId: departamentoFijo })
    setError(null)
    onCerrar()
  }

  const enviar = async (e) => {
    e.preventDefault()
    const rol = form.rol.trim()
    if (!ROL_REGEX.test(rol)) {
      setError('El ROL debe tener el formato número-año. Ej: 1234-2026')
      return
    }
    setGuardando(true)
    setError(null)
    try {
      const exp = await expedientesApi.crear({ ...form, rol })
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
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Departamento <span className="text-red-500">*</span></span>
          <SelectorDepartamento value={form.departamentoId} opciones={DEPARTAMENTOS} onSeleccionar={(v) => setForm({ ...form, departamentoId: v })} />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">ROL <span className="text-red-500">*</span></span>
          <input value={form.rol} onChange={set('rol')} placeholder="1234-2026" className={CAMPO} />
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
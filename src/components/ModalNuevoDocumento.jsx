import { useState } from 'react'
import Boton from '@/components/Boton'
import Modal from '@/components/Modal'
import SelectorArchivo from '@/components/SelectorArchivo'
import { useSubirArchivo } from '@/hooks/expedientes'
import { CAMPO, TIPOS } from '@/lib/constantes'

const INICIAL = { tipo: '', nombre: '', observaciones: '' }

export default function ModalNuevoDocumento({ abierto, expedienteId, onCerrar, onListo }) {
  const [form, setForm] = useState(INICIAL)
  const [archivo, setArchivo] = useState(null)
  const { agregarDocumento, validarArchivo, subiendo, error } = useSubirArchivo()

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })
  const errorArchivo = validarArchivo(archivo)
  const completo = archivo && !errorArchivo && form.tipo && form.nombre

  const cerrar = () => {
    setForm(INICIAL)
    setArchivo(null)
    onCerrar()
  }

  const enviar = async (e) => {
    e.preventDefault()
    const resultado = await agregarDocumento(expedienteId, form, archivo)
    if (resultado) {
      setForm(INICIAL)
      setArchivo(null)
      onListo()
    }
  }

  return (
    <Modal abierto={abierto} titulo="Agregar documento al expediente" onCerrar={cerrar}>
      <form onSubmit={enviar}>
        <SelectorArchivo archivo={archivo} onSeleccionar={setArchivo} error={errorArchivo} />

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Tipo de documento <span className="text-red-500">*</span></span>
          <select value={form.tipo} onChange={set('tipo')} className={`${CAMPO} cursor-pointer`}>
            <option value="">Seleccionar…</option>
            {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Nombre o descripción <span className="text-red-500">*</span></span>
          <input value={form.nombre} onChange={set('nombre')} placeholder="Ej: Parte denuncia Carabineros" className={CAMPO} />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Observaciones</span>
          <textarea rows={2} value={form.observaciones} onChange={set('observaciones')} className={CAMPO} />
        </label>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-5 flex justify-end gap-3">
          <Boton type="button" variante="secundario" onClick={cerrar}>Cancelar</Boton>
          <Boton type="submit" disabled={!completo || subiendo}>
            {subiendo ? 'Subiendo…' : 'Agregar documento'}
          </Boton>
        </div>
      </form>
    </Modal>
  )
}
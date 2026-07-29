import { useState } from 'react'
import Boton from '@/components/Boton'
import Modal from '@/components/Modal'
import SelectorArchivo from '@/components/SelectorArchivo'
import { useSubirArchivo } from '@/hooks/expedientes'
import { CAMPO } from '@/lib/constantes'

export default function ModalNuevoDocumento({ abierto, expedienteId, onCerrar, onListo }) {
  const [nombre, setNombre] = useState('')
  const [archivo, setArchivo] = useState(null)
  const { agregarDocumento, validarArchivo, subiendo, error } = useSubirArchivo()

  const errorArchivo = validarArchivo(archivo)
  const completo = archivo && !errorArchivo && nombre.trim()

  const cerrar = () => {
    setNombre('')
    setArchivo(null)
    onCerrar()
  }

  const enviar = async (e) => {
    e.preventDefault()
    const resultado = await agregarDocumento(expedienteId, { nombre: nombre.trim() }, archivo)
    if (resultado) {
      setNombre('')
      setArchivo(null)
      onListo()
    }
  }

  return (
    <Modal abierto={abierto} titulo="Agregar documento al expediente" onCerrar={cerrar}>
      <form onSubmit={enviar}>
        <SelectorArchivo archivo={archivo} onSeleccionar={setArchivo} error={errorArchivo} />

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Nombre del documento <span className="text-red-500">*</span></span>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Parte denuncia Carabineros" className={CAMPO} />
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
import { useState } from 'react'
import Boton from '@/components/Boton'
import Modal from '@/components/Modal'
import SelectorArchivo from '@/components/SelectorArchivo'
import { useSubirDocumento } from '@/hooks/documentos'
import { CAMPO } from '@/lib/estilos'

export default function ModalNuevaVersion({ abierto, documentoId, onCerrar, onListo }) {
  const [archivo, setArchivo] = useState(null)
  const [motivo, setMotivo] = useState('')
  const { versionar, validarArchivo, subiendo, error } = useSubirDocumento()

  const errorArchivo = validarArchivo(archivo)
  const completo = archivo && !errorArchivo && motivo.trim().length >= 5

  const cerrar = () => {
    setArchivo(null)
    setMotivo('')
    onCerrar()
  }

  const enviar = async (e) => {
    e.preventDefault()
    const resultado = await versionar(documentoId, motivo.trim(), archivo)
    if (resultado) {
      setArchivo(null)
      setMotivo('')
      onListo()
    }
  }

  return (
    <Modal abierto={abierto} titulo="Subir nueva versión" onCerrar={cerrar}>
      <form onSubmit={enviar}>
        <p className="text-sm text-slate-500">El archivo actual pasará al historial y esta versión quedará como vigente.</p>

        <div className="mt-4">
          <SelectorArchivo archivo={archivo} onSeleccionar={setArchivo} error={errorArchivo} />
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Motivo del reemplazo <span className="text-red-500">*</span></span>
          <textarea rows={3} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej: Reescaneo, faltaba la página 3" className={CAMPO} />
        </label>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-5 flex justify-end gap-3">
          <Boton type="button" variante="secundario" onClick={cerrar}>Cancelar</Boton>
          <Boton type="submit" disabled={!completo || subiendo}>
            {subiendo ? 'Subiendo…' : 'Subir versión'}
          </Boton>
        </div>
      </form>
    </Modal>
  )
}
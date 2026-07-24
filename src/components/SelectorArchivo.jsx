import { useRef, useState } from 'react'
import { FileText, Upload, X } from 'lucide-react'
import { formatearTamano } from '@/lib/expedientes'

export default function SelectorArchivo({ archivo, onSeleccionar, error }) {
  const inputRef = useRef(null)
  const [sobre, setSobre] = useState(false)

  const base = 'flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors'
  const estado = error ? 'border-red-300 bg-red-50' : sobre ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'

  if (archivo) {
    return (
      <div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <FileText size={22} className="shrink-0 text-blue-600" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">{archivo.name}</p>
            <p className="text-xs text-slate-500">{formatearTamano(archivo.size)}</p>
          </div>
          <button type="button" onClick={() => onSeleccionar(null)} title="Quitar archivo" className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600">
            <X size={18} />
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    )
  }

  return (
    <div>
      <div onClick={() => inputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setSobre(true) }} onDragLeave={() => setSobre(false)} onDrop={(e) => { e.preventDefault(); setSobre(false); onSeleccionar(e.dataTransfer.files[0] ?? null) }} className={`${base} ${estado}`}>
        <Upload size={28} className="text-slate-400" />
        <p className="text-sm font-medium text-slate-700">Arrastra el archivo escaneado o haz click aquí</p>
        <p className="text-xs text-slate-500">Solo archivos PDF · Máximo 25 MB</p>
      </div>

      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => onSeleccionar(e.target.files[0] ?? null)} />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}
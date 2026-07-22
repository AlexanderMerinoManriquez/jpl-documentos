import { useRef, useState } from 'react'
import { Calendar } from 'lucide-react'

const soloDigitos = (s) => s.replace(/\D/g, '').slice(0, 8)

const conSeparadores = (d) => {
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

const isoATexto = (iso) => {
  if (!iso) return ''
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

const textoAIso = (texto) => {
  const d = soloDigitos(texto)
  if (d.length !== 8) return null
  const dia = Number(d.slice(0, 2))
  const mes = Number(d.slice(2, 4))
  const anio = Number(d.slice(4))
  const fecha = new Date(anio, mes - 1, dia)
  if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) return null
  if (fecha > new Date()) return null
  return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}

const hoyIso = () => new Date().toISOString().slice(0, 10)

const CLASE = 'w-full rounded-xl border bg-white py-2.5 pl-3 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100'

export default function CampoFecha({ value, onChange }) {
  const [texto, setTexto] = useState(isoATexto(value))
  const [valorVisto, setValorVisto] = useState(value)
  const [tocado, setTocado] = useState(false)
  const nativoRef = useRef(null)

  if (value !== valorVisto) {
    setValorVisto(value)
    setTexto(isoATexto(value))
  }

  const escribir = (e) => {
    const nuevo = conSeparadores(soloDigitos(e.target.value))
    setTexto(nuevo)
    setValorVisto(textoAIso(nuevo) ?? '')
    onChange(textoAIso(nuevo) ?? '')
  }

  const invalido = tocado && texto.length > 0 && !textoAIso(texto)
  const borde = invalido ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-blue-400'

  return (
    <div>
      <div className="relative">
        <input value={texto} onChange={escribir} onBlur={() => setTocado(true)} placeholder="dd/mm/aaaa" inputMode="numeric" className={`${CLASE} ${borde}`} />
        <button type="button" onClick={() => nativoRef.current?.showPicker?.()} title="Abrir calendario" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600">
          <Calendar size={16} />
        </button>
        <input ref={nativoRef} type="date" value={value || ''} max={hoyIso()} onChange={(e) => onChange(e.target.value)} className="pointer-events-none absolute bottom-0 right-3 h-0 w-0 opacity-0" tabIndex={-1} />
      </div>

      <div className="mt-1 flex items-center justify-between gap-2">
        {invalido && <p className="text-xs text-red-600">Fecha inválida o posterior a hoy.</p>}
        {!invalido && <span />}
        <button type="button" onClick={() => onChange(hoyIso())} className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700">
          Hoy
        </button>
      </div>
    </div>
  )
}
import { useEffect, useMemo, useRef, useState } from 'react'
import { useClickAfuera } from '@/hooks/ui'
import { Check, ChevronDown, Search } from 'lucide-react'


const BASE = 'flex w-full cursor-pointer items-center justify-between gap-2 text-left text-[15px] text-slate-800 transition'

const VARIANTES = {
  campo: 'rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none',
  plano: 'bg-transparent px-5 py-3.5 outline-none',
}

export default function SelectorDepartamento({ value, opciones, onSeleccionar, placeholder = 'Seleccionar departamento…', variante = 'campo', className = '' }) {
  const [abierto, setAbierto] = useState(false)
  const [filtro, setFiltro] = useState('')
  const [indice, setIndice] = useState(0)
  const contenedor = useRef(null)
  const inputRef = useRef(null)

  const lista = useMemo(() => {
    const q = filtro.trim().toLowerCase()
    if (!q) return opciones
    return opciones.filter((o) => o.nombre.toLowerCase().includes(q))
  }, [filtro, opciones])

  useClickAfuera(contenedor, abierto, () => setAbierto(false))

  useEffect(() => {
    if (abierto) inputRef.current?.focus()
  }, [abierto])

  const elegir = (opcion) => {
    onSeleccionar(opcion.id)
    setAbierto(false)
    setFiltro('')
    setIndice(0)
  }

  const teclado = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndice((i) => Math.min(i + 1, lista.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndice((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (lista[indice]) elegir(lista[indice])
    } else if (e.key === 'Escape') {
      setAbierto(false)
    }
  }

  const actual = opciones.find((o) => o.id === value)

  return (
    <div ref={contenedor} className={`relative w-full ${className}`}>
      <button type="button" onClick={() => setAbierto((v) => !v)} className={`${BASE} ${VARIANTES[variante]}`}>
        <span className={`truncate ${actual ? '' : 'text-slate-400'}`}>{actual?.nombre ?? placeholder}</span>
        <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${abierto ? 'rotate-180' : ''}`} />
      </button>

      {abierto && (
        <div className="absolute z-20 mt-1.5 w-full min-w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="relative border-b border-slate-100">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input ref={inputRef} value={filtro} onChange={(e) => { setFiltro(e.target.value); setIndice(0) }} onKeyDown={teclado} placeholder="Buscar Departamento" className="w-full py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400" />
          </div>

          <ul className="max-h-60 overflow-y-auto py-1">
            {lista.map((opcion, i) => {
              const seleccionada = opcion.id === value
              const resaltada = i === indice
              return (
                <li key={opcion.id}>
                  <button type="button" onMouseEnter={() => setIndice(i)} onClick={() => elegir(opcion)} className={`flex w-full cursor-pointer items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm transition-colors ${resaltada ? 'bg-blue-50' : ''} ${seleccionada ? 'font-medium text-blue-700' : 'text-slate-700'}`}>
                    <span className="truncate">{opcion.nombre}</span>
                    {seleccionada && <Check size={16} className="shrink-0 text-blue-600" />}
                  </button>
                </li>
              )
            })}

            {lista.length === 0 && <li className="px-3.5 py-3 text-sm text-slate-400">Sin resultados.</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
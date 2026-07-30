const BASE = 'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition-all disabled:cursor-not-allowed'

const TAMANOS = {
  md: 'px-6 py-3 text-[15px]',
  sm: 'px-3.5 py-2 text-sm',
}

const VARIANTES = {
  primario: 'bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none',
  secundario: 'border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60',
  peligro: 'bg-red-600 text-white shadow-sm shadow-red-600/20 hover:bg-red-700 disabled:bg-slate-300 disabled:shadow-none',
}

export default function Boton({ variante = 'primario', tamano = 'md', className = '', ...props }) {
  return <button className={`${BASE} ${TAMANOS[tamano]} ${VARIANTES[variante]} ${className}`} {...props} />
}
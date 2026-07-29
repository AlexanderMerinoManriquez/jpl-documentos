const BASE = 'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-medium transition-all disabled:cursor-not-allowed'

const VARIANTES = {
  primario: 'bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none',
  secundario: 'border border-slate-200 text-slate-700 hover:bg-slate-50',
}

export default function Boton({ variante = 'primario', className = '', ...props }) {
  return <button className={`${BASE} ${VARIANTES[variante]} ${className}`} {...props} />
}
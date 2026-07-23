import { ChevronLeft, ChevronRight } from 'lucide-react'

const BOTON = 'flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border border-slate-200 px-3 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'

export default function Paginacion({ pagina, totalPaginas, onCambiar }) {
  if (totalPaginas <= 1) return null

  const paginas = []
  const desde = Math.max(1, Math.min(pagina - 2, totalPaginas - 4))
  const hasta = Math.min(totalPaginas, desde + 4)
  for (let i = desde; i <= hasta; i++) paginas.push(i)

  return (
    <div className="mt-5 flex items-center justify-center gap-1.5">
      <button type="button" onClick={() => onCambiar(pagina - 1)} disabled={pagina === 1} className={BOTON}>
        <ChevronLeft size={18} />
      </button>

      {desde > 1 && <span className="px-1 text-sm text-slate-400">…</span>}

      {paginas.map((n) => (
        <button key={n} type="button" onClick={() => onCambiar(n)} className={n === pagina ? `${BOTON} border-blue-600 bg-blue-600 font-medium text-white hover:bg-blue-700` : BOTON}>
          {n}
        </button>
      ))}

      {hasta < totalPaginas && <span className="px-1 text-sm text-slate-400">…</span>}

      <button type="button" onClick={() => onCambiar(pagina + 1)} disabled={pagina === totalPaginas} className={BOTON}>
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
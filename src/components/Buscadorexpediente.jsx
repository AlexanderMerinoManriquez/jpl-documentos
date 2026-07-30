import { ArrowRight, Search } from 'lucide-react'
import SelectorDepartamento from '@/components/SelectorDepartamento'
import { DEPARTAMENTOS_PUBLICOS } from '@/lib/constantes'

export default function BuscadorExpediente({ rol, departamentoId, buscando, error, onEscribir, onDepartamento, onEnviar }) {
  return (
    <form onSubmit={onEnviar}>
      <div className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 transition-all focus-within:border-blue-400 focus-within:shadow-2xl focus-within:ring-4 focus-within:ring-blue-100 sm:flex-row sm:items-center sm:rounded-full">
        <div className="w-full sm:w-64 sm:shrink-0">
          <SelectorDepartamento value={departamentoId} opciones={DEPARTAMENTOS_PUBLICOS} onSeleccionar={onDepartamento} placeholder="Seleccionar juzgado…" variante="plano" />
        </div>

        <span className="h-px w-full bg-slate-100 sm:h-8 sm:w-px" />

        <div className="relative flex-1">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={rol} onChange={onEscribir} placeholder="Ingresa el ROL. Ej: 1234-2026" className="w-full bg-transparent py-4 pl-12 pr-4 text-base outline-none placeholder:text-slate-400" />
        </div>

        <button type="submit" disabled={buscando} title="Consultar" className="mr-2 hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none sm:flex">
        {buscando
          ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          : <ArrowRight size={20} />}
        </button>
      </div>

      {error && <p className="animate-aparecer mt-3 px-2 text-center text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={buscando} className="mt-4 w-full cursor-pointer rounded-2xl bg-blue-600 py-4 text-base font-medium text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:bg-slate-300 sm:hidden">
        {buscando ? 'Buscando…' : 'Consultar'}
      </button>
    </form>
  )
}
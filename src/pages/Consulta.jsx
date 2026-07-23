import { useState } from 'react'
import { ArrowLeft, Building2, FileSearch, Search } from 'lucide-react'
import Boton from '@/components/Boton'
import VisorArchivo from '@/components/VisorArchivo'
import { useConsultaPublica } from '@/hooks/consultaPublica'
import { etiquetaCodigo, nombreInstitucion } from '@/lib/constantes'
import { fechaUltimaActualizacion, formatearFecha, versionActiva } from '@/lib/documentos'
import { CAMPO } from '@/lib/estilos'

export default function Consulta() {
  const [codigo, setCodigo] = useState('')
  const [elegido, setElegido] = useState(null)
  const { consultar, limpiar, resultados, buscando, error } = useConsultaPublica()

  const buscar = async (e) => {
    e.preventDefault()
    setElegido(null)
    const data = await consultar(codigo)
    if (data.length === 1) setElegido(data[0])
  }

  const reiniciar = () => {
    setElegido(null)
    limpiar()
  }

  if (elegido) return <Documento documento={elegido} onVolver={reiniciar} />

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
        <h1 className="text-2xl font-semibold text-slate-900">Consultar documento</h1>
        <p className="mt-1 text-sm text-slate-500">Ingresa el código o ROL de la causa para ver el documento digitalizado.</p>

        <form onSubmit={buscar} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ej: C-1234-2026" className={`${CAMPO} pl-11`} />
          </div>
          <Boton type="submit" disabled={!codigo.trim() || buscando} className="shrink-0">
            {buscando ? 'Buscando…' : 'Consultar'}
          </Boton>
        </form>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      </div>

      {resultados?.length === 0 && (
        <div className="mt-5 flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-md">
          <FileSearch size={32} className="text-slate-300" />
          <p className="text-slate-800">No se encontró ningún documento con ese código.</p>
          <p className="text-sm text-slate-500">Verifica que esté escrito correctamente.</p>
        </div>
      )}

      {resultados?.length > 1 && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <p className="text-sm text-slate-600">Este código existe en más de una institución. Selecciona cuál corresponde:</p>
          <ul className="mt-4 space-y-2">
            {resultados.map((d) => (
              <li key={d.id}>
                <button type="button" onClick={() => setElegido(d)} className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition-colors hover:bg-slate-50">
                  <Building2 size={20} className="shrink-0 text-blue-600" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{nombreInstitucion(d.institucionId)}</p>
                    <p className="text-sm text-slate-500">{d.tipo}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Documento({ documento, onVolver }) {
  return (
    <div>
      <button type="button" onClick={onVolver} className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800">
        <ArrowLeft size={16} />
        Nueva consulta
      </button>

      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{etiquetaCodigo(documento.institucionId)}</p>
        <h1 className="text-2xl font-semibold text-slate-900">{documento.codigo}</h1>

        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
          <Dato label="Institución" valor={nombreInstitucion(documento.institucionId)} />
          <Dato label="Tipo" valor={documento.tipo} />
          <Dato label="Última actualización" valor={formatearFecha(fechaUltimaActualizacion(documento))} />
        </dl>
      </div>

      <div className="mt-5">
        <VisorArchivo version={versionActiva(documento)} />
      </div>
    </div>
  )
}

function Dato({ label, valor }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-[15px] text-slate-800">{valor || '—'}</dd>
    </div>
  )
}
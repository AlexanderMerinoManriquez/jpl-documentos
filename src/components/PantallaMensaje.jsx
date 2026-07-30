export default function PantallaMensaje({ texto, tono }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <p className={`text-sm ${tono === 'error' ? 'text-red-600' : 'text-slate-500'}`}>{texto}</p>
    </div>
  )
}
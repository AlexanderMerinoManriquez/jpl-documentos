import { useEffect } from 'react'

export function useClickAfuera(ref, activo, onFuera) {
  useEffect(() => {
    if (!activo) return
    const escuchar = (e) => {
      if (!ref.current?.contains(e.target)) onFuera()
    }
    document.addEventListener('mousedown', escuchar)
    return () => document.removeEventListener('mousedown', escuchar)
  }, [ref, activo, onFuera])
}
export const ROLES = {
  ADMIN: 'admin',
  ENCARGADO: 'encargado',
  FUNCIONARIO: 'funcionario',
  PUBLICO: 'publico',
}

const PERMISOS = {
  [ROLES.ADMIN]:       { verDocumentos: true,  digitalizar: true,  versionar: true,  estadisticas: true,  todasInstituciones: true  },
  [ROLES.ENCARGADO]:   { verDocumentos: true,  digitalizar: true,  versionar: true,  estadisticas: true,  todasInstituciones: false },
  [ROLES.FUNCIONARIO]: { verDocumentos: true,  digitalizar: true,  versionar: true,  estadisticas: false, todasInstituciones: false },
  [ROLES.PUBLICO]:     { verDocumentos: false, digitalizar: false, versionar: false, estadisticas: false, todasInstituciones: false },
}

const SIN_PERMISOS = { verDocumentos: false, digitalizar: false, versionar: false, estadisticas: false, todasInstituciones: false }

export function usarSesion() {
    
  const usuario = { nombre: '', rol: ROLES.ADMIN, institucionId: null }

  const permisos = PERMISOS[usuario?.rol] ?? SIN_PERMISOS

  return {
    usuario,
    permisos,
    institucionFija: permisos.todasInstituciones ? '' : (usuario?.institucionId ?? ''),
  }
}
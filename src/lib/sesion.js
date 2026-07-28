export const ROLES = {
  ADMIN: 'admin',
  ENCARGADO: 'encargado',
  FUNCIONARIO: 'funcionario',
  PUBLICO: 'publico',
}

export const ROL_LABEL = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.ENCARGADO]: 'Encargado',
  [ROLES.FUNCIONARIO]: 'Funcionario',
  [ROLES.PUBLICO]: 'Consulta',
}

const PERMISOS = {
  [ROLES.ADMIN]:       { verLista: true,  digitalizar: true,  versionar: true,  verHistorial: true,  estadisticas: true,  todasInstituciones: true  },
  [ROLES.ENCARGADO]:   { verLista: true,  digitalizar: true,  versionar: true,  verHistorial: false, estadisticas: true,  todasInstituciones: false },
  [ROLES.FUNCIONARIO]: { verLista: true,  digitalizar: true,  versionar: true,  verHistorial: false, estadisticas: false, todasInstituciones: false },
  [ROLES.PUBLICO]:     { verLista: false, digitalizar: false, versionar: false, verHistorial: false, estadisticas: false, todasInstituciones: false },
}

const SIN_PERMISOS = { verLista: false, digitalizar: false, versionar: false, verHistorial: false, estadisticas: false, todasInstituciones: false }

export function useSesion() {
  const usuario = { nombre: '', rol: ROLES.FUNCIONARIO, institucionId: null }

  const permisos = PERMISOS[usuario?.rol] ?? SIN_PERMISOS

  return {
    usuario,
    permisos,
    institucionFija: permisos.todasInstituciones ? '' : (usuario?.institucionId ?? ''),
  }
}
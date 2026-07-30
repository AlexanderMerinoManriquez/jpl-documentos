const ROLES = {
  ADMIN: 'admin',
  ENCARGADO: 'encargado',
  FUNCIONARIO: 'funcionario',
  PUBLICO: 'publico',
}

export const ROL_LABEL = {
  [ROLES.ADMIN]: 'JPL1 • Juan Peréz',
  [ROLES.ENCARGADO]: 'Encargado',
  [ROLES.FUNCIONARIO]: 'Funcionario',
  [ROLES.PUBLICO]: 'Consulta',
}

const PERMISOS = {
  [ROLES.ADMIN]:       { digitalizar: true,  estadisticas: true  },
  [ROLES.ENCARGADO]:   { digitalizar: true,  estadisticas: true  },
  [ROLES.FUNCIONARIO]: { digitalizar: true,  estadisticas: false },
  [ROLES.PUBLICO]:     { digitalizar: false, estadisticas: false },
}

const SIN_PERMISOS = { digitalizar: false, estadisticas: false }

export function useSesion() {
  const usuario = { nombre: '', rol: ROLES.ADMIN, departamentoId: null }

  return {
    usuario,
    permisos: PERMISOS[usuario?.rol] ?? SIN_PERMISOS,
  }
}
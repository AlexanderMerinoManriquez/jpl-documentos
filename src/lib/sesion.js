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
  [ROLES.ADMIN]:       { digitalizar: true },
  [ROLES.ENCARGADO]:   { digitalizar: true },
  [ROLES.FUNCIONARIO]: { digitalizar: true },
  [ROLES.PUBLICO]:     { digitalizar: false },
}

const SIN_PERMISOS = { digitalizar: false }

export function useSesion() {
  const usuario = { nombre: '', rol: ROLES.ADMIN, institucionId: null }

  return {
    usuario,
    permisos: PERMISOS[usuario?.rol] ?? SIN_PERMISOS,
  }
}
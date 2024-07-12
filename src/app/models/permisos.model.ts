export interface PermisoBasico {
  READ?: boolean
  DISABLE?: boolean
  DISABLE_MY?: boolean
  DELETE?: boolean
  READ_MY?: boolean
  CREATE?: boolean
  CREATE_MY?: boolean
  READ_ALL?: boolean
  ENABLE?: boolean
  ENABLE_MY?: boolean
  WRITE?: boolean
  WRITE_MY?: boolean
  FOR_DEPARTMENT?: boolean
}

export interface PermisosUsuario{
  backoffice?: boolean;
  permission?: PermisoBasico
  role?: PermisoBasico
  typeRole?: PermisoBasico
  user?: PermisoBasico
  producer?: PermisoBasico
  ranch?: PermisoBasico
  plot?: PermisoBasico
  typeCrop?:PermisoBasico
  location?: PermisoBasico
  department?: PermisoBasico
  province?: PermisoBasico
  company?: PermisoBasico
  administrator?: PermisoBasico
  technicalManager?: PermisoBasico
  technical?:PermisoBasico
  manager?: PermisoBasico
  operator?: PermisoBasico
  cooperative?: PermisoBasico
  employee?: PermisoBasico
  profile?: PermisoBasico
  drone?:PermisoBasico
  supplies?:PermisoBasico
}

export interface UserToken{
 exp: number;
 iat: number;
 location?: number [];
 name: string
 roles: RolToken []
 sub: string;
 userId: number;
}

export interface RolToken{
  authority: string;
}


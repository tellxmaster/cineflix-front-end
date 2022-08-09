export interface AuthResponse{
    ok: boolean;
    token: string;
    bearer: string;
    nombreUsuario: string;
    authorities: string[];
}

export interface Usuario{
    ok: Boolean;
    token: string;
    nombreUsuario: string;
}
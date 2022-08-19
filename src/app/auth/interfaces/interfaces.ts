export interface AuthResponse{
    token: string;
    bearer: string;
    nombreUsuario: string;
    authorities: string[];
    mensaje?: string;
}

export interface RegisterResponse{
    mensaje: string;
}

export interface Usuario{
    token: string;
    nombreUsuario: string;
}
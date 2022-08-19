export interface Socio {
    id: number;
    cedula: String;
    nombre: String;
    direccion: String;
    telefono: String;
    correo: String;
    updated_at: Date;
    created_at: Date;
}

export interface SocioSend {
    cedula: String;
    nombre: String;
    direccion: String;
    telefono: String;
    correo: String;
    updated_at: Date;
    created_at: Date;
}


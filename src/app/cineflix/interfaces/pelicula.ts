import { Director } from "./director";
import { Formato } from "./formato";
import { Genero } from "./genero";

export interface Pelicula {
    id: number;
    gen_id: number;
    dir_id: number;
    for_id: number;
    pel_nombre: String;
    pel_costo: number;
    pel_fecha_est: Date;
    director?: Director;
    genero?: Genero;
    formato?: Formato;
}

import { Pelicula } from "./pelicula";
import { Socio } from "./socio";

export interface Alquiler {
    id: number;
    soc_id: number;
    pel_id: number;
    alq_fecha_desde: Date;
    alq_fecha_hasta: Date;
    alq_valor: number;
    alq_fecha_entrega: Date;
    socio?: Socio;
    peliculaAlq?: Pelicula;
}

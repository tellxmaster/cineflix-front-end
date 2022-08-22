import { Sexo } from "./sexo";

export interface Actor {
    id: number;
    sex_id: number;
    act_nombre: String;
    sexo?: Sexo;
}

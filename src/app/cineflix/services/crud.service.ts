import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomResponse } from '../interfaces/custom-response';
import { Socio } from '../interfaces/socio';
import { Actor } from '../interfaces/actor';
import { Director } from '../interfaces/director';
import { Sexo } from '../interfaces/sexo';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private readonly apiURL = 'http://localhost:8080';
  
  constructor(private http: HttpClient) { }

  //ACTORES
  actores$ = <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiURL}/actor/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  saveActor$ = (actor: Actor) => <Observable<CustomResponse>>
  this.http.post<CustomResponse>(`${this.apiURL}/actor/save`, actor)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  deleteActor$ = (actorId: number) => <Observable<CustomResponse>>
  this.http.delete<CustomResponse>(`${this.apiURL}/actor/delete/${actorId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  //FIN ACTORES


  //DIRECTORES
  directores$ = <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiURL}/director/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  saveDirector$ = (director: Director) => <Observable<CustomResponse>>
  this.http.post<CustomResponse>(`${this.apiURL}/director/save`, director)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  deleteDirector$ = (directorId: number) => <Observable<CustomResponse>>
  this.http.delete<CustomResponse>(`${this.apiURL}/director/delete/${directorId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  //FIN DIRECTORES

  //SOCIOS
  socios$ = <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiURL}/socio/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  saveSocio$ = (socio: Socio) => <Observable<CustomResponse>>
  this.http.post<CustomResponse>(`${this.apiURL}/socio/save`, socio)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  deleteSocio$ = (socioId: number) => <Observable<CustomResponse>>
  this.http.delete<CustomResponse>(`${this.apiURL}/socio/delete/${socioId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  //FIN SOCIOS


  //SEXOS

  sexos$ = <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiURL}/sexo/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  saveSexo$ = (sexo: Sexo) => <Observable<CustomResponse>>
  this.http.post<CustomResponse>(`${this.apiURL}/sexo/save`, sexo)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  deleteSexo$ = (sexoId: number) => <Observable<CustomResponse>>
  this.http.delete<CustomResponse>(`${this.apiURL}/sexo/delete/${sexoId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  //FIN SEXOS
  private handleError(error: HttpErrorResponse): Observable<never>{
    console.log(error);
    return throwError(`Ocurrio un Error - Codigo: ${error.status}`);
  }
}

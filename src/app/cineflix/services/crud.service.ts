import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomResponse } from '../interfaces/custom-response';
import { Socio, SocioSend } from '../interfaces/socio';
import { Actor } from '../interfaces/actor';
import { Director } from '../interfaces/director';
import { Sexo } from '../interfaces/sexo';
import { ActivatedRoute } from '@angular/router';
import { Formato } from '../interfaces/formato';
import { Genero } from '../interfaces/genero';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private readonly apiURL = 'http://localhost:8080';
  private page = 0;
  
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


  updateDirector$ = (director: Director) => <Observable<CustomResponse>>
  this.http.put<CustomResponse>(`${this.apiURL}/director/update`, director)
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

  saveSocio$ = (socio: SocioSend) => <Observable<CustomResponse>>
  this.http.post<CustomResponse>(`${this.apiURL}/socio/save`, socio)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  updateSocio$ = (socio: Socio) => <Observable<CustomResponse>>
  this.http.put<CustomResponse>(`${this.apiURL}/socio/update`, socio)
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

  updateSexo$ = (sexo: Sexo) => <Observable<CustomResponse>>
  this.http.put<CustomResponse>(`${this.apiURL}/sexo/update`, sexo)
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

  //FORMATO

  formatos$ = <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiURL}/formato/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  saveFormato$ = (formato: Formato) => <Observable<CustomResponse>>
  this.http.post<CustomResponse>(`${this.apiURL}/formato/save`, formato)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  updateFormato$ = (formato: Formato) => <Observable<CustomResponse>>
  this.http.put<CustomResponse>(`${this.apiURL}/formato/update`, formato)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  deleteFormato$ = (formatoId: number) => <Observable<CustomResponse>>
  this.http.delete<CustomResponse>(`${this.apiURL}/formato/delete/${formatoId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  //FIN FORMATO

  //GENERO
  generos$ = <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiURL}/genero/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  saveGenero$ = (genero: Genero) => <Observable<CustomResponse>>
  this.http.post<CustomResponse>(`${this.apiURL}/genero/save`, genero)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  updateGenero$ = (genero: Genero) => <Observable<CustomResponse>>
  this.http.put<CustomResponse>(`${this.apiURL}/genero/update`, genero)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  deleteGenero$ = (generoId: number) => <Observable<CustomResponse>>
  this.http.delete<CustomResponse>(`${this.apiURL}/genero/delete/${generoId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );
  //FIN GENERO


  
  private handleError(error: HttpErrorResponse): Observable<never>{
    console.log(error);
    return throwError(`Ocurrio un Error - Codigo: ${error.status}`);
  }

  public setPage(page: any){
    this.page = page;
  }
}

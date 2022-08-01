import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomResponse } from '../interfaces/custom-response';
import { Socio } from '../interfaces/socio';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private readonly apiURL = 'http://localhost:8080';
  
  constructor(private http: HttpClient) { }

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

  private handleError(error: HttpErrorResponse): Observable<never>{
    console.log(error);
    return throwError(`Ocurrio un Error - Codigo: ${error.status}`);
  }
}

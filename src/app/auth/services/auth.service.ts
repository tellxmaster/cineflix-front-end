import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthResponse, RegisterResponse, Usuario } from '../interfaces/interfaces';
import { catchError, map, tap } from 'rxjs/operators'
import { of } from 'rxjs';


const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string =  environment.baseUrl;
  private _usuario!: Usuario;
  roles: Array<string> = [];

  get usuario(){
    return {...this._usuario };
  }

  constructor( private http: HttpClient ) { }


  public setToken(token: string): void{
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY,token);
  }

  public setUserName(username: string): void{
    localStorage.removeItem(USERNAME_KEY);
    localStorage.setItem(USERNAME_KEY,username);
  }

  public setAuthorities(authorities: string[]): void{
    localStorage.removeItem(AUTHORITIES_KEY);
    localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getToken(): string{
    return localStorage.getItem(TOKEN_KEY)!;
  }

  public getUserName(): string{
    return localStorage.getItem(USERNAME_KEY)!;
  }

  public getAuthorities(): string[]{
    
    this.roles = [];

    if (localStorage.getItem(AUTHORITIES_KEY)) {
      JSON.parse(localStorage.getItem(AUTHORITIES_KEY)!).forEach((authority: any) => {
        this.roles.push(authority.authority);
      });
    }
    return this.roles;
  }


  login( nombreUsuario: string, password: string ){
    
    const url = `${this.baseUrl}/auth/login`;
    const body = { nombreUsuario, password };

    return this.http.post<AuthResponse>(url, body)
    .pipe(
      tap( res =>{
        if(res.token){
          this.setToken(res.token);
          this.setUserName(res.nombreUsuario);
          this.setAuthorities(res.authorities);
          this._usuario = {
            nombreUsuario: res.nombreUsuario,
            token: res.token
          }
        }
      }),
      map( res => res.token ),
      catchError( mensaje => of(mensaje) )
    );
  }

  registro(nombre: string, nombreUsuario: string, email: string, password: string){
    const url = `${this.baseUrl}/auth/nuevo`;
    const body = { nombre, nombreUsuario, email, password};

    return this.http.post<RegisterResponse>(url, body)
    .pipe(
      tap( res =>{
        if(res.mensaje === "usuario guardado"){
          console.log(res.mensaje);
        }
      }),
      map( res => res.mensaje ),
      catchError( err => of(err) )
    );
  }

}

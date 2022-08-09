import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  constructor() { }

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
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)!).forEach((authority: any) => {
        this.roles.push(authority);
      });
    }
    return this.roles;
  }

  public logOut(): void{
    window.sessionStorage.clear();
  }


}

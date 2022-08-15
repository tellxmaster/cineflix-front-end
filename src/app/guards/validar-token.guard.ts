import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate{

  realRol!: string;

  constructor( private authService: AuthService, private router: Router){ }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    const expectedRol = route.data['expectedRol'];
    const roles = this.authService.getAuthorities();
    console.log(roles);
    this.realRol = 'user';
    roles.forEach(rol => {
      if(rol === 'ROLE_ADMIN'){
        this.realRol = 'admin';
      }
    });
    if(!this.authService.getToken()){
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
  
  /*canActivate(): Observable<boolean> | boolean {
    //console.log('canActivate');
    return this.authService.validarToken()
    .pipe(
      tap( valid => {
        if(!valid){
          this.router.navigateByUrl('/auth/login')
        }
      })
    );
  }

  canLoad(): Observable<boolean> | boolean {
    //console.log('canLoad');
    return this.authService.validarToken().pipe(
      tap( valid => {
        if(!valid){
          this.router.navigateByUrl('/auth/login')
        }
      })
    );
  }*/
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad {

  realRol!: string;

  constructor( private authService: AuthService, private router: Router){ }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log('canActivate');
    // const expectedRol = route.data['expectedRol'];
    // const roles = this.authService.getAuthorities();
    // this.realRol = 'user';
    // roles.forEach(rol => {
    //   if(rol === 'ROLE_ADMIN'){
    //     this.realRol = 'admin'
    //   }
    // });
    // if(this.authService.getToken() || expectedRol.indexOf(this.realRol)===-1){
    //   this.router.navigate(['/auth']);
    //   return false;
    // }
    return true;
  }
  canLoad(): Observable<boolean> | boolean {
    console.log('canLoad');
    return true;
  }
}

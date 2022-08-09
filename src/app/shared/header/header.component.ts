import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  constructor(private router: Router, private authService: AuthService) { }

  username = this.authService.getUserName();

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/auth/login')
  }

}

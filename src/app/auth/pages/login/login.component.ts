import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal  from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent{

  LoginForm: FormGroup = this.fb.group({
    nombreUsuario:    ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor( private fb: FormBuilder, private router: Router, private authService: AuthService){}

  login(){
    const {nombreUsuario, password } = this.LoginForm.value;
    this.authService.login(nombreUsuario,password)
    .subscribe(res => {
      if( res != null){
        this.router.navigate(['/dashboard/stats']);
      }else{
        Swal.fire('Error',res, 'error');
      }
    })
    
  }

}

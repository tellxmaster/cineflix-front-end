import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent{

  RegisterForm: FormGroup = this.fb.group({
    nombre:          ['', [Validators.required]],
    nombreUsuario:   ['', [Validators.required]],
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor( private fb: FormBuilder, private router: Router, private authService: AuthService ){}

  register(){
    const {nombre, nombreUsuario, email, password } = this.RegisterForm.value;
    this.authService.registro(nombre, nombreUsuario, email, password)
    .subscribe(mensaje => {
      console.log(mensaje);
      if( mensaje === "usuario guardado" ){
        this.router.navigate(['/dashboard/stats']);
      }else{
        Swal.fire('Error',mensaje, 'error');
      }
    })
  }

}

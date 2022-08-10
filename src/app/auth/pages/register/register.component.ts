import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor( private fb: FormBuilder, private router: Router  ){}

  register(){
    console.log(this.RegisterForm.value);
    console.log(this.RegisterForm.valid);
    this.router.navigateByUrl('/dashboard');
  }

}

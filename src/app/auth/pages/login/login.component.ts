import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent{

  LoginForm: FormGroup = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor( private fb: FormBuilder, private router: Router  ){}

  login(){
    console.log(this.LoginForm.value);
    console.log(this.LoginForm.valid);

    this.router.navigateByUrl('/dashboard');
  }

}

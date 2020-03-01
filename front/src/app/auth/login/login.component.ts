import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;

  constructor(public authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      submit: ['']
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(form) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value)
      .subscribe(
        res => {
          localStorage.setItem('auth', 'true');
          localStorage.setItem('userId', res['userId']);
          this.router.navigate(['/']);
        },
        err => {
          if (err.includes('Wrong combination')) {
            this.loginForm.controls.submit.setErrors({'wrong': true});
          } else {
            this.loginForm.controls.submit.setErrors({'error': true});
          }
        }
      );

  }

}

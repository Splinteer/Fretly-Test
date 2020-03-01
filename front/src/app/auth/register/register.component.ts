import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;

  constructor(public authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }


  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      type: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      submit: ['']
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(form) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }


    this.authService.register(this.registerForm.value)
      .subscribe(
        res => {
          localStorage.setItem('auth', 'true');
          localStorage.setItem('userId', res['userId']);
          this.router.navigate(['/']);
        },
        err => {
          if (err.message && err.message.includes('email is already used')) {
            this.registerForm.controls.email.setErrors({'used': true});
          } else if (err.message && err.message.includes('should be an email')) {
            this.registerForm.controls.email.setErrors({'email': true});
          } else {
            this.registerForm.controls.submit.setErrors({'error': true});
          }
        }
      );

  }

}

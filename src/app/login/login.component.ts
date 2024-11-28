import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatFormField} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from "../helpers/auth.service";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    ReactiveFormsModule,
    MatButton,
    HttpClientModule,
    RouterModule,
    MatInput
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,  private authService: AuthService ,private router: Router, private http: HttpClient,) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const {username, password} = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        (response: any) => {
          console.log('Login succesvol:', response.message);

          this.authService.setToken(response.token);

          this.router.navigate(['/chat']);
        },
        (error) => {
          console.error('Fout bij inloggen:', error);
        }
      );
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']); // Navigeer naar het register component
  }
}

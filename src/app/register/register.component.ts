import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from "@angular/material/card";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormField } from "@angular/material/form-field";
import { MatButton } from "@angular/material/button";
import { MatInput } from "@angular/material/input";
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password, confirmPassword } = this.registerForm.value;

      if (password !== confirmPassword) {
        console.error('Wachtwoorden komen niet overeen');
        return;
      }


      const newUser = { username, password, email };

      this.http.post('http://localhost:8080/auth/register', newUser).subscribe(
        (response: any) => {
          console.log(response.message);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Fout bij het registreren:', error);
        }
      );
    }
  }

  navigateToLogin() {
    this.router.navigate(['/']); // Navigeer terug naar het login component
  }
}

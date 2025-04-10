import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  successMessage = '';
  errorMessage = '';
  emailExists = false;

  constructor(private router: Router) {}
// Signup
  onSignup(form: NgForm) {
    if (form.invalid) return;

    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
   
    if (users.some((user: any) => user.email === this.email)) {
      this.emailExists = true;
      this.errorMessage = 'Email is already registered!';
      return;
    } else {
      this.emailExists = false;
      this.errorMessage = '';
    }

      users.push({ username: this.username, email: this.email, password: this.password });
    localStorage.setItem('users', JSON.stringify(users));

    this.successMessage = 'Account created successfully! Redirecting to login...';

  // Set Timeout For Retirect on Login Page
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}

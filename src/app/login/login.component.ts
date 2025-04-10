import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, RouterModule, CommonModule],
})
export class LoginComponent {
  username = '';
  password = '';
  rememberMe = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}
// Login
  onLogin() {
    console.log('Logging in with:', this.username, this.password);

    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

  
    const validUser = users.find(
      (user: any) => user.username === this.username && user.password === this.password
    );

    if (validUser) {
      this.successMessage = 'Login successful! Redirecting...';

   
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({ name: validUser.username, email: validUser.email })
      );

      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000);
    } else {
      this.errorMessage = 'Invalid username or password!';
      this.clearMessagesAfterDelay();
    }
  }
// In REdirect on Home Page
  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
}

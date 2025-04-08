import { Routes, provideRouter } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { TaskCreateComponent } from './task-create/task-create.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'create-task/:id', component: TaskCreateComponent }
];

export const appRoutingProviders = [
  provideRouter(routes)
];

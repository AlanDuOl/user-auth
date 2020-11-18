import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../api-auth/login/login.component';
import { LogoutComponent } from '../api-auth/logout/logout.component';
import { RegisterComponent } from '../api-auth/register/register.component';
import { ResetPasswordComponent } from '../api-auth/reset-password/reset-password.component';
import { CanDeactivateGuard } from './can-deactivate.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'logout', component: LogoutComponent },
  { path: 'register', component: RegisterComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'changePassword', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiAuthRoutingModule { }

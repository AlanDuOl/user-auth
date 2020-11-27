import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../api-auth/login/login.component';
import { LogoutComponent } from '../api-auth/logout/logout.component';
import { RegisterComponent } from '../api-auth/register/register.component';
import { ResetPasswordComponent } from '../api-auth/reset-password/reset-password.component';
import { RequestCodeComponent } from '../api-auth/request-code/request-code.component';
import { SendCodeComponent } from '../api-auth/send-code/send-code.component';
import { VerifyComponent } from '../api-auth/verify/verify.component';
import { CanDeactivateGuard } from './can-deactivate.guard';
import { uiPath } from '../constants';

const routes: Routes = [
  { path: uiPath.login, component: LoginComponent, canDeactivate: [CanDeactivateGuard] },
  { path: uiPath.logout, component: LogoutComponent },
  { path: uiPath.verify, component: VerifyComponent },
  { path: uiPath.register, component: RegisterComponent, canDeactivate: [CanDeactivateGuard] },
  { path: uiPath.sendCode, component: SendCodeComponent },
  { path: uiPath.requestCode, component: RequestCodeComponent },
  { path: uiPath.resetPassword, component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiAuthRoutingModule { }

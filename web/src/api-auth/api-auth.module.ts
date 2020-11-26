import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiAuthRoutingModule } from './api-auth-routing.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthMenuComponent } from './auth-menu/auth-menu.component';
import { ValidationErrorComponent } from '../app/validation-error/validation-error.component';
import { VerifyComponent } from './verify/verify.component';


@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ValidationErrorComponent,
    AuthMenuComponent,
    VerifyComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ApiAuthRoutingModule
  ],
  exports: [
    AuthMenuComponent,
    LoginComponent,
    LogoutComponent
  ]
})
export class ApiAuthModule { }

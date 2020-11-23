import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { User } from '../../models';
import { DialogService } from '../dialog.service';
import { passwordConstraints } from '../../utils';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { uiPath } from 'src/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(100)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(100)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(8),
      passwordConstraints
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(8),
      passwordConstraints
    ]),
  });

  startSubmmit = false;

  requestError = {
    message: 'Failed to create user',
    on: false
  }

  constructor(private auth: AuthService, private dialog: DialogService, private router: Router) { }

  ngOnInit(): void {
  }

  canDeactivate(): Observable<boolean> {
    if (!this.form.pristine) {
      // if form has been touched and is valid, allow navigation without pop-up if it started after
      // a submit
      if (this.form.valid && this.startSubmmit) {
        return of(true);
      }
      // show pop-up to allow navigation
      return this.dialog.confirmation();
    }
    // if form has not been touched allow navigation without pop-up
    return of(true);
  }

  handleSubmit(): void {
    if (this.form.valid) {
      this.startSubmmit = true;
      const user = this.getRegisterData();
      this.auth.register(user).subscribe(
        () => {
          // navigate to login on successful registration
          this.router.navigate([uiPath.login]);
        },
        err => {
          // set error message on request error
          this.requestError.on = true;
          this.requestError.message = err.error?.message;
        }
      );
    }
  }

  private getRegisterData(): User {
    const user: User = {
      name: this.form.get('name').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value,
      confirmPassword: this.form.get('confirmPassword').value
    }
    return user;
  }

}

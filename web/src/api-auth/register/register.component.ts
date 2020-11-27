import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
  pageLoading = false;
  message$: BehaviorSubject<string | null> = new BehaviorSubject(null);

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
    // proceed if form data is valid
    if (this.form.valid) {
      // allow navigation without canDeactivate pop-up
      this.startSubmmit = true;
      // check if passwords are equal
      if (this.passwordsEqual()) {
        // get form data in correct format
        const user = this.getRegisterData();
        // set page loader to wait async operation
        this.pageLoading = true;
        // submit new user data
        this.auth.register(user).subscribe(
          () => {
            // remove page loader after async operation
            this.pageLoading = false;
            // inform user about registration and verification email
            
            // navigate to login on successful registration
            this.router.navigate([uiPath.login]);
          },
          err => {
            // allow canDeactivate pop-up if request failed
            this.startSubmmit = false;
            // set error message on request error
            !!err.error ? this.message$.next(err.error.message) : this.message$.next(null);
            // remove page loader after async operation
            this.pageLoading = false;
          }
        );
      }
      else {
        // allow canDeactivate pop-up if passwords validation failed
        this.startSubmmit = false;
        // set validation failed message
        this.message$.next('Passwords are different');
      }
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

  private passwordsEqual(): boolean {
    if (this.form.get('password').value === this.form.get('confirmPassword').value) {
      return true;
    }
    return false;
  }

}

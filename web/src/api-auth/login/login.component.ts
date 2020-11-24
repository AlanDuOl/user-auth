import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LoginUser } from 'src/models';
import { AuthService } from '../auth.service';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
    password: new FormControl('',
      [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(6)
      ]),
    keepLogged: new FormControl('')
  });
  startSubmmit = false;
  message$: BehaviorSubject<string | null> = new BehaviorSubject(null);

  constructor(private auth: AuthService, private dialog: DialogService) { }

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

  async handleSubmit(): Promise<void> {
    if (this.form.valid) {
      this.startSubmmit = true;
      const user = this.getLoginData();
      try {
        await this.auth.login(user, this.form.get('keepLogged').value);
      } catch (err) {
        console.log(err)
        this.startSubmmit = false;
        this.message$.next(err.error.message)
      }
    }
  }

  private getLoginData(): LoginUser {
    const user: LoginUser = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    }
    return user;
  }

}

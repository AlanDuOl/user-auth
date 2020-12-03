import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LoginUser } from 'src/models';
import { AuthService } from '../auth.service';
import { DialogService } from '../dialog.service';
import { ResponseFeedback, FeedBackType } from '../../models';

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
  isLoading = false;
  response: BehaviorSubject<ResponseFeedback | null> = new BehaviorSubject(null);

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
      try {
        this.startSubmmit = true;
        const user = this.getLoginData();
        // put loader while async operation is running
        this.isLoading = true;
        await this.auth.login(user);
        // remove loader when async operation is finished
        this.isLoading = false;
      } catch (err) {
        this.startSubmmit = false;
        this.response.next({
          message: err.error.message,
          id: err.error.id ? err.error.id : null,
          type: FeedBackType.error,
        });
        // remove loader when async operation is finished
        this.isLoading = false;
      }
    }
  }

  private getLoginData(): LoginUser {
    const user: LoginUser = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
      keepLogged: !!this.form.get('keepLogged').value
    }
    return user;
  }

  requestVerificationEmail(userId: number): void {
    if (!!userId) {
      // put loader while async operation is running
      this.isLoading = true;
      this.auth.requestVerificationEmail(userId).subscribe(
        res => {
          this.response.next({
            message: res.message,
            id: undefined,
            type: FeedBackType.success,
          });
          // remove loader when async operation is finished
          this.isLoading = false;
        },
        err => {
          this.response.next({
            message: err.error.message,
            id: undefined,
            type: FeedBackType.error,
          });
          // remove loader when async operation is finished
          this.isLoading = false;
        }
      )
    }
  }

}

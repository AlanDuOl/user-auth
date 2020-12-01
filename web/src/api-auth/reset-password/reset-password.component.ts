import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { uiPath } from 'src/constants';
import { ResetPassword } from 'src/models';
import { passwordConstraints, passwordsEqual } from 'src/utils';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetId: string;
  form = new FormGroup({
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
    ])
  });
  isLoading = false;
  message = new BehaviorSubject<string | null>(null);

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private auth: AuthService) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate([uiPath.home]);
    }
    this.resetId = id;
  }

  resetPassword(): void {
    if (this.form.valid) {
      // call submit method
      if (passwordsEqual(this.form)) {
        this.isLoading = true;
        const submitData = this.getSubmitData();
        this.auth.resetPassword(submitData).subscribe(
          () => {
            this.isLoading = false;
            this.router.navigate([uiPath.login]);
          },
          err => {
            this.message.next(err.error.message);
            this.isLoading = false;
          }
        );
      }
      else {
        this.message.next('Passwords are different');
      }
    }
  }

  getSubmitData(): ResetPassword {
    const data = {
      password: this.form.get('password').value,
      confirmPassword: this.form.get('confirmPassword').value,
      token: this.resetId
    }
    return data;
  }

}

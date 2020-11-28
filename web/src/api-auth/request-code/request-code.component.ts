import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { uiPath } from 'src/constants';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-request-code',
  templateUrl: './request-code.component.html',
  styleUrls: ['./request-code.component.scss']
})
export class RequestCodeComponent implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required])
  })
  isLoading = false;
  message: BehaviorSubject<string | null> = new BehaviorSubject(null);

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  requestCode() {
    // if form data is valid, request reset code
    if (this.form.valid) {
      this.isLoading = true;
      const email = this.form.get('email').value;
      this.auth.requestResetCode(email).subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate([`/${uiPath.sendCode}`]);
        },
        err => {
          this.message.next(err.error.message);
          this.isLoading = false;
        }
      );
    }
  }
}

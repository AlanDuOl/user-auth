import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { uiPath } from 'src/constants';

@Component({
  selector: 'app-send-code',
  templateUrl: './send-code.component.html',
  styleUrls: ['./send-code.component.scss']
})
export class SendCodeComponent implements OnInit {

  form = new FormGroup({
    code: new FormControl('', [Validators.required])
  })
  isLoading = false;
  message: BehaviorSubject<string | null> = new BehaviorSubject(null);

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  sendCode() {
    // if form data is valid, request reset code
    if (this.form.valid) {
      this.isLoading = true;
      const code = this.form.get('code').value;
      this.auth.sendResetCode(code).subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate([`/${uiPath.resetPassword}`]);
        },
        (err: any) => {
          this.message.next(err.error.message);
          this.isLoading = false;
        }
      );
    }
  }
}

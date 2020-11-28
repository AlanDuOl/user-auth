import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-send-code',
  templateUrl: './send-code.component.html',
  styleUrls: ['./send-code.component.scss']
})
export class SendCodeComponent implements OnInit {

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

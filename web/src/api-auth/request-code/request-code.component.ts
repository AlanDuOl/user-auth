import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
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
  response: BehaviorSubject<string | null> = new BehaviorSubject(null);
  
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  requestCode() {
    const email = this.form.get('email').value;
    this.auth.requestResetCode(email).subscribe(
      res => {

      },
      err => {

      }
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../../models';
import { apiPath } from '../../constants';
import { DialogService } from '../dialog.service';
import { containsValue } from '../../utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    email: new FormControl('', [Validators.email, Validators.required, Validators.maxLength(100)]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(8),
      Validators.minLength(6),
      containsValue
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.maxLength(8),
      Validators.minLength(6),
    ]),
  });

  constructor(private http: HttpClient, private dialog: DialogService) { }

  ngOnInit(): void {
    console.log(this.form.get('password'));
  }

  canDeactivate(): Observable<boolean> {
    if (!this.form.pristine) {
      // if form has been touched and is valid, allow navigation without pop-up
      if (this.form.valid) {
        return of(true);
      }
      // show pop-up to allow navigation
      return this.dialog.confirmation();
    }
    // if form has not been touched allow navigation without pop-up
    return of(true);
  }

  handleSubmit(): void {
    console.log(this.form)
  }

  submitData(data: User): Observable<any> {
    return this.http.post<any>(apiPath.register, data);
  }

}

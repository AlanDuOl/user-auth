import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../../models';
import { apiPath } from '../../constants';
import { DialogService } from '../dialog.service';

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
      Validators.maxLength(8)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.maxLength(8)
    ]),
  });

  constructor(private http: HttpClient, private dialog: DialogService) { }

  ngOnInit(): void {
  }

  canDeactivate(): Observable<boolean> {
    if (!this.form.pristine) {
      return this.dialog.confirmation();
    }
    return of(true);
  }

  handleSubmit(): void {
    console.log(this.form)
  }

  submitData(data: User): Observable<any> {
    return this.http.post<any>(apiPath.register, data);
  }

}

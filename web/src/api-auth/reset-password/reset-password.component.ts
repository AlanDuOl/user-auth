import { Component, OnInit } from '@angular/core';
import { ResetPassword } from '../../models';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPhase: ResetPassword = ResetPassword.sendCode;

  constructor() { }

  ngOnInit(): void {
    
  }

}

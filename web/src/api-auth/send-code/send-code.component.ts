import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-send-code',
  templateUrl: './send-code.component.html',
  styleUrls: ['./send-code.component.scss']
})
export class SendCodeComponent implements OnInit {

  form = new FormGroup({
    resetCode: new FormControl('', [Validators.email, Validators.required])
  })

  constructor() { }

  ngOnInit(): void {
  }

  sendCode() {
    
  }

}

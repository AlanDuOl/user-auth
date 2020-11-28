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
  response: BehaviorSubject<string | null> = new BehaviorSubject(null);

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  

}

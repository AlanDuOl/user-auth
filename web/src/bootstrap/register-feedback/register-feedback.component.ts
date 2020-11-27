import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register-feedback',
  templateUrl: './register-feedback.component.html',
  styleUrls: ['./register-feedback.component.scss']
})
export class RegisterFeedbackComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}

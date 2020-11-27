import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiPath } from '../../constants';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterFeedbackComponent } from '../../bootstrap/register-feedback/register-feedback.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private modal: NgbModal) { }

  ngOnInit(): void {
  }

  fakeRequest() {
    this.http.get(apiPath.get).subscribe(
      res => console.log(res),
      err => console.log(err),
    )
  }

  openModal() {
    const modalRef = this.modal.open(RegisterFeedbackComponent);
  }

}

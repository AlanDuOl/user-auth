import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiPath } from '../../constants';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  message = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  publicRequest() {
    this.http.get(apiPath.get).subscribe(
      res => console.log(res),
      err => console.log(err),
    )
  }

  adminRequest() {

  }

  userRequest() {

  }

}

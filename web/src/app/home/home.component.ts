import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiPath } from '../../constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  fakeRequest() {
    this.http.get(apiPath.get).subscribe(
      res => console.log(res),
      err => console.log(err),
    )
  }

}

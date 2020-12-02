import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiPath } from '../../constants';
import { BehaviorSubject } from 'rxjs';
import { AuthUser } from 'src/models';

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

  publicRequest(): void {
    this.http.get<any>(apiPath.publicRequest).subscribe(
      res => {
        this.message.next(res.message);
      },
      err => {
        this.message.next(err.error.message);
      }
    );
  }

  adminRequest(): void {
    const id = this.getUserId();
    this.http.get<any>(`${apiPath.adminRequest}/${id}`).subscribe(
      res => {
        this.message.next(res.message);
      },
      err => {
        this.message.next(err.error.message);
      }
    );
  }

  userRequest(): void {
    this.http.get<any>(apiPath.userRequest).subscribe(
      res => {
        this.message.next(res.message);
      },
      err => {
        this.message.next(err.error.message);
      }
    );
  }

  getUserId(): number {
    let user: AuthUser = null;
    // try to find user in sessionStorage
    user = JSON.parse(sessionStorage.getItem('user'));
    if (!!user) {
      return user.id;
    }
    else {
      // if user is not found in sessionStorage, try to find it in localStorage
      user = JSON.parse(localStorage.getItem('user'));
      if (!!user) {
        return user.id;
      }
      // no user found, return a number that has no user
      return 0;
    }
  }

}

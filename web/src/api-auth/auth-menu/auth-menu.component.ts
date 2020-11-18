import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-menu',
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.scss']
})
export class AuthMenuComponent implements OnInit {

  isAutheticated: Observable<boolean>;
  userName: Observable<string>;
  
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.isAutheticated = this.auth.isAuthenticated();
    this.userName = this.auth.getUser().pipe(map(u => u && u.name));
  }

}

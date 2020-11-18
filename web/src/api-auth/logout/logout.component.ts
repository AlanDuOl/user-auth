import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  $message: Observable<string> = null;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.$message = this.auth.logout();
  }

}

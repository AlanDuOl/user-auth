import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  message: BehaviorSubject<string | null> = new BehaviorSubject(null);
  token: string;

  constructor(private activatedRoute: ActivatedRoute, private auth: AuthService) { }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
    if (!!this.token) {
      this.auth.sendVerification(this.token).subscribe(
        res => {
          this.message.next(res.message);
        },
        err => {
          this.message.next(err.error.message);
        }
      )
    }
  }

}

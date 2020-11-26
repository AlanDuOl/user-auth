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

  constructor(private activatedRoute: ActivatedRoute, private auth: AuthService) { }

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.queryParamMap.get('token');
    if (!!token) {
      this.auth.sendVerification(token).subscribe(
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

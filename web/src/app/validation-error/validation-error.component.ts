import { Component, OnInit, Input } from '@angular/core';
import { validationMessage } from '../../constants';

@Component({
  selector: 'app-validation-error',
  templateUrl: './validation-error.component.html',
  styleUrls: ['./validation-error.component.css']
})
export class ValidationErrorComponent implements OnInit {

  @Input() errors: any;
  errorMessage: { [key: string]: string } = validationMessage;

  constructor() { }

  ngOnInit() {
  }

}

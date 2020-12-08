import { Component, OnInit, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { validationMessage } from '../../constants';

@Component({
  selector: 'app-validation-error',
  templateUrl: './validation-error.component.html',
  styleUrls: ['./validation-error.component.scss']
})
export class ValidationErrorComponent implements OnInit {

  @Input() errors: ValidationErrors;
  errorMessage: { [key: string]: string } = validationMessage;

  constructor() { }

  ngOnInit() {
  }

}

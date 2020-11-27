import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterFeedbackComponent } from './register-feedback/register-feedback.component';


@NgModule({
  declarations: [RegisterFeedbackComponent],
  imports: [
    NgbModule,
    CommonModule
  ],
  exports: [RegisterFeedbackComponent]
})
export class BootstrapModule { }

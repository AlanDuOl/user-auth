// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ValidationErrors } from '@angular/forms';
// // import { validationMessage } from '../constants';
// import { ValidationErrorComponent } from './validation-error.component';

// describe('ValidationErrorComponent', () => {
//   let component: ValidationErrorComponent;
//   let fixture: ComponentFixture<ValidationErrorComponent>;
//   let element: HTMLElement;
//   const mockErrors: ValidationErrors = {
//     required: "",
//     email: "",
//     pattern: "",
//     maxlength: ""
//   }

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ValidationErrorComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ValidationErrorComponent);
//     component = fixture.componentInstance;
//     element = fixture.debugElement.nativeElement;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('#errorElements should have the same size of #mockErrors', () => {
//     const errorKeys = Object.keys(mockErrors);
//     component.errors = mockErrors;
//     fixture.detectChanges();
//     const errorElements = element.querySelector('.error-message').children;
//     expect(errorElements.length).toBeGreaterThan(0);
//     expect(errorKeys.length).toBe(errorElements.length);
//   });

//   it('#errorElements textContent should be in #validationMessage values', () => {
//     const errorValues = Object.values(validationMessage);
//     component.errors = mockErrors;
//     fixture.detectChanges();
//     const errorElements = element.querySelector('.error-message').children;
//     for (let index = 0; index < errorElements.length; index++) {
//       expect(errorValues).toContain(errorElements[index].textContent.trim());
//     }
//   });
// });

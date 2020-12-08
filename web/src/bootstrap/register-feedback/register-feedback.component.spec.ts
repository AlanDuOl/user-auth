import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RegisterFeedbackComponent } from './register-feedback.component';

describe('RegisterFeedbackComponent', () => {
  let component: RegisterFeedbackComponent;
  let fixture: ComponentFixture<RegisterFeedbackComponent>;
  let mockactiveModal: Partial<NgbActiveModal>;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    mockactiveModal = {
      close: jasmine.createSpy('close').and.callFake(() => {})
    }
    TestBed.configureTestingModule({
      declarations: [ RegisterFeedbackComponent ],
      providers: [
        { provide: NgbActiveModal, useValue: mockactiveModal }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFeedbackComponent);
    component = fixture.componentInstance;
    activeModal = fixture.debugElement.injector.get(NgbActiveModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('click on btn should call close', () => {
    const click = new Event('click');
    const btn = document.querySelector('.btn');
    // act
    btn.dispatchEvent(click);
    // assert
    expect(activeModal.close).toHaveBeenCalled();
  });
});

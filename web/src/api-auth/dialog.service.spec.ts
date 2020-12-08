import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { MockConfirm } from '../mock-data';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#confirmation should emit true', () => {
    // override window.confirm
    MockConfirm.install();
    // define return value
    MockConfirm.willReturn(true);
    // act
    const result = service.confirmation();
    // assert
    result.subscribe(
      res => {
        expect(res).toBe(true);
      },
      () => {
        expect(true).toBe(false);
      }
    );
    // remove window.confirm override
    MockConfirm.uninstall();
  });

  it('#confirmation should emit false', () => {
    // override window.confirm
    MockConfirm.install();
    // define return value
    MockConfirm.willReturn(false);
    // act
    const result = service.confirmation();
    // assert
    result.subscribe(
      res => {
        expect(res).toBe(false);
      },
      () => {
        expect(true).toBe(false);
      }
    );
    // remove window.confirm override
    MockConfirm.uninstall();
  });

});

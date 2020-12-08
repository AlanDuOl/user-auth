import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { CanDeactivateGuard } from './can-deactivate.guard';

describe('CanDeactivateGuard', () => {
  let guard: CanDeactivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanDeactivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('#canDeactivated should return true', () => {
    const mockCanDeactivate = { 
      canDeactivate: () => { return of(true) }
    }
    const result = guard.canDeactivate(mockCanDeactivate);
    // assert
    (result as Observable<boolean>).subscribe(
      res => {
        expect(res).toBe(true);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it('#canDeactivated should return false', () => {
    const mockCanDeactivate = { 
      canDeactivate: () => { return of(false) }
    }
    const result = guard.canDeactivate(mockCanDeactivate);
    // assert
    (result as Observable<boolean>).subscribe(
      res => {
        expect(res).toBe(false);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

});

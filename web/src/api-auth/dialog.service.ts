import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  confirmation(): Observable<boolean> {
    const result = window.confirm('Discard form data?');
    return of(result);
  }
}

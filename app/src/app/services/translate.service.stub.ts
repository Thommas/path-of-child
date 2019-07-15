/**
 * Path of child
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class TranslateServiceStub {
  public get() {
    return of({});
  }
}

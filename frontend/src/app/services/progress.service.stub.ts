/**
 * Path of child
 *
 * Service - Progress
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

export class ProgressServiceStub {
  countChange: EventEmitter<number>;
  count: number;
  progress: number;
  timer: Observable<any>;
  timerSubscription: Subscription;

  trackObservable(obs: Observable<any>): Observable<any> {
    return obs;
  }
}

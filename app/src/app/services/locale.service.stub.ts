/**
 * Path of child
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import { Injectable } from '@angular/core';

@Injectable()
export class LocaleServiceStub {
  public init() {}
  public setLocale(newLocale) {}
  public get locales() {
    return [];
  }
}

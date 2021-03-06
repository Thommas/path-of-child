/**
 * Path of child
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import { Injectable } from '@angular/core';
import { BrowserService } from './browser.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AngularticsService {
  /**
   * Constructor
   */
  constructor(private browserService: BrowserService) {}

  /**
   * Initialize google analytics with UA in environment
   */
  init() {
    if (!environment.googleAnalyticsId || !this.browserService.document) {
      return;
    }
    const document = this.browserService.document;
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    const code = `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', '${environment.googleAnalyticsId}', 'auto');`;
    scriptElement.appendChild(document.createTextNode(code));
    document.body.appendChild(scriptElement);
  }
}

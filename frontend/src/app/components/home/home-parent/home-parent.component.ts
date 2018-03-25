/**
 * Path of child
 *
 * Component - Home - Home Parent
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import { Component } from '@angular/core';
import { BuildService, ChildService } from '../../../services';

@Component({
  selector: 'app-home-parent-cmp',
  templateUrl: './home-parent.component.html',
  styleUrls: ['./home-parent.component.scss']
})
export class HomeParentComponent {
  constructor(
    public buildService: BuildService,
    public childService: ChildService
  ) {}
}

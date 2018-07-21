/**
 * Path of child
 *
 * Component - Build
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

import {
  routing,
  BuildFormComponent,
  BuildShowComponent,
  TaskIndexComponent,
  TaskItemComponent,
  TaskListComponent,
  TaskShowComponent
} from './';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    routing,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  declarations: [
    BuildFormComponent,
    BuildShowComponent,
    TaskIndexComponent,
    TaskItemComponent,
    TaskListComponent,
    TaskShowComponent
  ],
  providers: [
  ]
})
export class BuildModule {
}

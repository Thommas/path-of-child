/**
 * Path of child
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AuthService, AuthServiceStub } from '../../../services';
import { Apollo } from 'apollo-angular';
import { ApolloStub } from '../../../services';
import { TagFormComponent } from './tag-form.component';

describe('TagFormComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      declarations: [
        TagFormComponent
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: Apollo, useClass: ApolloStub },
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(TagFormComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
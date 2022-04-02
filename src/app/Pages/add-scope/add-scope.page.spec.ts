import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScopePage } from './add-scope.page';

describe('AddScopePage', () => {
  let component: AddScopePage;
  let fixture: ComponentFixture<AddScopePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScopePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScopePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

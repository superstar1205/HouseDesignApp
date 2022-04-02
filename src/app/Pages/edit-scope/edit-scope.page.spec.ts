import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditScopePage } from './edit-scope.page';

describe('EditScopePage', () => {
  let component: EditScopePage;
  let fixture: ComponentFixture<EditScopePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditScopePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditScopePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

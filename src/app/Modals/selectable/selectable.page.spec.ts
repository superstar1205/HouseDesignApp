import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectablePage } from './selectable.page';

describe('SelectablePage', () => {
  let component: SelectablePage;
  let fixture: ComponentFixture<SelectablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectablePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

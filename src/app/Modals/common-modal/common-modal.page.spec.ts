import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModalPage } from './common-modal.page';

describe('CommonModalPage', () => {
  let component: CommonModalPage;
  let fixture: ComponentFixture<CommonModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

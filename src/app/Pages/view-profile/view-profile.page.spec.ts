import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfilePage } from './view-profile.page';

describe('ViewProfilePage', () => {
  let component: ViewProfilePage;
  let fixture: ComponentFixture<ViewProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

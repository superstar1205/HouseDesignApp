import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailQuotePage } from './detail-quote.page';

describe('DetailQuotePage', () => {
  let component: DetailQuotePage;
  let fixture: ComponentFixture<DetailQuotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailQuotePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailQuotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

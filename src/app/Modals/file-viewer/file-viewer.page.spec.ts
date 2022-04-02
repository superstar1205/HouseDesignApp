import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileViewerPage } from './file-viewer.page';

describe('FileViewerPage', () => {
  let component: FileViewerPage;
  let fixture: ComponentFixture<FileViewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileViewerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

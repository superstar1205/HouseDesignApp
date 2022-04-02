import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstimatePage } from './estimate.page';

describe('Tab1Page', () => {
  let component: EstimatePage;
  let fixture: ComponentFixture<EstimatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EstimatePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstimatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecoinsPopupStepThreeComponent } from './freecoins-popup-step-three.component';

describe('FreecoinsPopupStepThreeComponent', () => {
  let component: FreecoinsPopupStepThreeComponent;
  let fixture: ComponentFixture<FreecoinsPopupStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecoinsPopupStepThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecoinsPopupStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

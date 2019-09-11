import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecoinsPopupStepOneComponent } from './freecoins-popup-step-one.component';

describe('FreecoinsPopupStepOneComponent', () => {
  let component: FreecoinsPopupStepOneComponent;
  let fixture: ComponentFixture<FreecoinsPopupStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecoinsPopupStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecoinsPopupStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecoinsPopupStepTwoComponent } from './freecoins-popup-step-two.component';

describe('FreecoinsPopupStepTwoComponent', () => {
  let component: FreecoinsPopupStepTwoComponent;
  let fixture: ComponentFixture<FreecoinsPopupStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecoinsPopupStepTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecoinsPopupStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycStepTwoComponent } from './kyc-step-two.component';

describe('KycStepTwoComponent', () => {
  let component: KycStepTwoComponent;
  let fixture: ComponentFixture<KycStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycStepTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

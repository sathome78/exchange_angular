import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycStepOneComponent } from './kyc-step-one.component';

describe('KycStepOneComponent', () => {
  let component: KycStepOneComponent;
  let fixture: ComponentFixture<KycStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

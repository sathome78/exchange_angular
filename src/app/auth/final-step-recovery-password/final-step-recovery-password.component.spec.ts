import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalStepRecoveryPasswordComponent } from './final-step-recovery-password.component';

describe('FinalStepRecoveryPasswordComponent', () => {
  let component: FinalStepRecoveryPasswordComponent;
  let fixture: ComponentFixture<FinalStepRecoveryPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalStepRecoveryPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalStepRecoveryPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

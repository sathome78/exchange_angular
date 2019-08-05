import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwoWithdrawComponent } from './step-two-withdraw.component';

describe('StepTwoWithdrawComponent', () => {
  let component: StepTwoWithdrawComponent;
  let fixture: ComponentFixture<StepTwoWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepTwoWithdrawComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepTwoWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

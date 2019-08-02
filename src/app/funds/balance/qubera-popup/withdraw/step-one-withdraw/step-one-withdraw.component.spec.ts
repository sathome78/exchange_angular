import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOneWithdrawComponent } from './step-one-withdraw.component';

describe('StepOneWithdrawComponent', () => {
  let component: StepOneWithdrawComponent;
  let fixture: ComponentFixture<StepOneWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepOneWithdrawComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepOneWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

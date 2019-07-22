import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOneDepositComponent } from './step-one-deposit.component';

describe('StepOneDepositComponent', () => {
  let component: StepOneDepositComponent;
  let fixture: ComponentFixture<StepOneDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepOneDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepOneDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThreeWithdrawComponent } from './step-three-withdraw.component';

describe('StepThreeWithdrawComponent', () => {
  let component: StepThreeWithdrawComponent;
  let fixture: ComponentFixture<StepThreeWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepThreeWithdrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepThreeWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

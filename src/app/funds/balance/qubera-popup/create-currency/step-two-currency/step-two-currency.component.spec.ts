import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwoCurrencyComponent } from './step-two-currency.component';

describe('StepTwoCurrencyComponent', () => {
  let component: StepTwoCurrencyComponent;
  let fixture: ComponentFixture<StepTwoCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepTwoCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepTwoCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

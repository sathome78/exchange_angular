import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOneCurrencyComponent } from './step-one-currency.component';

describe('StepOneCurrencyComponent', () => {
  let component: StepOneCurrencyComponent;
  let fixture: ComponentFixture<StepOneCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepOneCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepOneCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

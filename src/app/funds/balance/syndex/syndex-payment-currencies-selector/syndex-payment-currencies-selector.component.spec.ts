import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndexPaymentCurrenciesSelectorComponent } from './syndex-payment-currencies-selector.component';

describe('SyndexPaymentCurrenciesSelectorComponent', () => {
  let component: SyndexPaymentCurrenciesSelectorComponent;
  let fixture: ComponentFixture<SyndexPaymentCurrenciesSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyndexPaymentCurrenciesSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndexPaymentCurrenciesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

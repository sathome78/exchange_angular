import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySelectFiatComponent } from './currency-select-fiat.component';

describe('CurrencySelectFiatComponent', () => {
  let component: CurrencySelectFiatComponent;
  let fixture: ComponentFixture<CurrencySelectFiatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencySelectFiatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencySelectFiatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

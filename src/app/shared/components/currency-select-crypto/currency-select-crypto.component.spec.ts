import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySelectCryptoComponent } from './currency-select-crypto.component';

describe('CurrencySelectCryptoComponent', () => {
  let component: CurrencySelectCryptoComponent;
  let fixture: ComponentFixture<CurrencySelectCryptoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencySelectCryptoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencySelectCryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

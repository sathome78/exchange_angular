import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyPairInfoMobileComponent } from './currency-pair-info-mobile.component';

describe('CurrencyPairInfoMobileComponent', () => {
  let component: CurrencyPairInfoMobileComponent;
  let fixture: ComponentFixture<CurrencyPairInfoMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyPairInfoMobileComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyPairInfoMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

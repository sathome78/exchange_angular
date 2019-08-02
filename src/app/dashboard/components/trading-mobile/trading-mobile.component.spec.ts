import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingMobileComponent } from './trading-mobile.component';

describe('TradingMobileComponent', () => {
  let component: TradingMobileComponent;
  let fixture: ComponentFixture<TradingMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TradingMobileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

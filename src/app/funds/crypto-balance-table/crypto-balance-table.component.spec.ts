import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoBalanceTableComponent } from './crypto-balance-table.component';

describe('CryptoBalanceTableComponent', () => {
  let component: CryptoBalanceTableComponent;
  let fixture: ComponentFixture<CryptoBalanceTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptoBalanceTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoBalanceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

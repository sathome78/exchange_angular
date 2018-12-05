import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoBalancesComponent } from './crypto-balances.component';

describe('CryptoBalancesComponent', () => {
  let component: CryptoBalancesComponent;
  let fixture: ComponentFixture<CryptoBalancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptoBalancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

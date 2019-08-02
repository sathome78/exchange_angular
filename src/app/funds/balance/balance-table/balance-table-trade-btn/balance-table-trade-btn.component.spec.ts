import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceTableTradeBtnComponent } from './balance-table-trade-btn.component';

describe('BalanceTableTradeBtnComponent', () => {
  let component: BalanceTableTradeBtnComponent;
  let fixture: ComponentFixture<BalanceTableTradeBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BalanceTableTradeBtnComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceTableTradeBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

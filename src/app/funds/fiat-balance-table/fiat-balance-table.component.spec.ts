import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiatBalanceTableComponent } from './fiat-balance-table.component';

describe('FiatBalanceTableComponent', () => {
  let component: FiatBalanceTableComponent;
  let fixture: ComponentFixture<FiatBalanceTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiatBalanceTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiatBalanceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

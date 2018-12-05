import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiatBalancesComponent } from './fiat-balances.component';

describe('FiatBalancesComponent', () => {
  let component: FiatBalancesComponent;
  let fixture: ComponentFixture<FiatBalancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiatBalancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiatBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

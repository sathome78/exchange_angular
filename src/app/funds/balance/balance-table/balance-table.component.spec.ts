import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceTableComponent } from './balance-table.component';

describe('BalanceTableComponent', () => {
  let component: BalanceTableComponent;
  let fixture: ComponentFixture<BalanceTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

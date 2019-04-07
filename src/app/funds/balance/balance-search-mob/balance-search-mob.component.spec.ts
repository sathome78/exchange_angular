import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSearchMobComponent } from './balance-search-mob.component';

describe('BalanceSearchMobComponent', () => {
  let component: BalanceSearchMobComponent;
  let fixture: ComponentFixture<BalanceSearchMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceSearchMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceSearchMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

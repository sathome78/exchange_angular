import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeHistoryItemComponent } from './trade-history-item.component';

describe('TradeHistoryItemComponent', () => {
  let component: TradeHistoryItemComponent;
  let fixture: ComponentFixture<TradeHistoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TradeHistoryItemComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

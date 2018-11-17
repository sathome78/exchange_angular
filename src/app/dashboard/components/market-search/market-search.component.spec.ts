import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketSearchComponent } from './market-search.component';

describe('MarketSearchComponent', () => {
  let component: MarketSearchComponent;
  let fixture: ComponentFixture<MarketSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

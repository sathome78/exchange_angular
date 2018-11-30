import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySearchComponent } from './currency-search.component';

describe('CurrencySearchComponent', () => {
  let component: CurrencySearchComponent;
  let fixture: ComponentFixture<CurrencySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

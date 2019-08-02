import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyPairInfoComponent } from './currency-pair-info.component';

describe('CurrencyPairInfoComponent', () => {
  let component: CurrencyPairInfoComponent;
  let fixture: ComponentFixture<CurrencyPairInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyPairInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyPairInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

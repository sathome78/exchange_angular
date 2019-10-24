import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndexPaymentSystemsSelectorComponent } from './syndex-payment-systems-selector.component';

describe('SyndexPaymentSystemsSelectorComponent', () => {
  let component: SyndexPaymentSystemsSelectorComponent;
  let fixture: ComponentFixture<SyndexPaymentSystemsSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyndexPaymentSystemsSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndexPaymentSystemsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

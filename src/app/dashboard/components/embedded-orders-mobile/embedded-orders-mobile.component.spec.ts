import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedOrdersMobileComponent } from './embedded-orders-mobile.component';

describe('EmbeddedOrdersMobileComponent', () => {
  let component: EmbeddedOrdersMobileComponent;
  let fixture: ComponentFixture<EmbeddedOrdersMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmbeddedOrdersMobileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedOrdersMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedOpenOrdersMobileComponent } from './embedded-open-orders-mobile.component';

describe('EmbeddedOpenOrdersMobileComponent', () => {
  let component: EmbeddedOpenOrdersMobileComponent;
  let fixture: ComponentFixture<EmbeddedOpenOrdersMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbeddedOpenOrdersMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedOpenOrdersMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

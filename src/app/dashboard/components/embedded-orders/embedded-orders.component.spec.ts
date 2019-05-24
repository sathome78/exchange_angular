import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedOrdersComponent } from './embedded-orders.component';

describe('EmbeddedOrdersComponent', () => {
  let component: EmbeddedOrdersComponent;
  let fixture: ComponentFixture<EmbeddedOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmbeddedOrdersComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

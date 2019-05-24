import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedOpenOrdersComponent } from './embedded-open-orders.component';

describe('EmbeddedOpenOrdersComponent', () => {
  let component: EmbeddedOpenOrdersComponent;
  let fixture: ComponentFixture<EmbeddedOpenOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmbeddedOpenOrdersComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedOpenOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

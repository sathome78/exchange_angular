import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndexOrderInfoComponent } from './syndex-order-info.component';

describe('SyndexOrderInfoComponent', () => {
  let component: SyndexOrderInfoComponent;
  let fixture: ComponentFixture<SyndexOrderInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyndexOrderInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndexOrderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

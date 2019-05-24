import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillMoneyComponent } from './refill-money.component';

describe('RefillMoneyComponent', () => {
  let component: RefillMoneyComponent;
  let fixture: ComponentFixture<RefillMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RefillMoneyComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

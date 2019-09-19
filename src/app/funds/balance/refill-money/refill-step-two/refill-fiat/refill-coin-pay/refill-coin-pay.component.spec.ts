import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillCoinPayComponent } from './refill-coin-pay.component';

describe('RefillCoinPayComponent', () => {
  let component: RefillCoinPayComponent;
  let fixture: ComponentFixture<RefillCoinPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefillCoinPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillCoinPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

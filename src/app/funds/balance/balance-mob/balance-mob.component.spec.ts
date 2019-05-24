import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceMobComponent } from './balance-mob.component';

describe('BalanceMobComponent', () => {
  let component: BalanceMobComponent;
  let fixture: ComponentFixture<BalanceMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BalanceMobComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

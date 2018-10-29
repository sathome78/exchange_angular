import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralChargesComponent } from './referral-charges.component';

describe('ReferralChargesComponent', () => {
  let component: ReferralChargesComponent;
  let fixture: ComponentFixture<ReferralChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

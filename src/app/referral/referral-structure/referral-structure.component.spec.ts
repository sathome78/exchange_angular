import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralStructureComponent } from './referral-structure.component';

describe('ReferralStructureComponent', () => {
  let component: ReferralStructureComponent;
  let fixture: ComponentFixture<ReferralStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralStructureComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

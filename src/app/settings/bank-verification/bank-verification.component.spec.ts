import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankVerificationComponent } from './bank-verification.component';

describe('BankVerificationComponent', () => {
  let component: BankVerificationComponent;
  let fixture: ComponentFixture<BankVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuberaKycComponent } from './qubera-kyc.component';

describe('QuberaKycComponent', () => {
  let component: QuberaKycComponent;
  let fixture: ComponentFixture<QuberaKycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuberaKycComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuberaKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

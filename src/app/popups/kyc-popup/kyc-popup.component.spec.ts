import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycPopupComponent } from './kyc-popup.component';

describe('KycPopupComponent', () => {
  let component: KycPopupComponent;
  let fixture: ComponentFixture<KycPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KycPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

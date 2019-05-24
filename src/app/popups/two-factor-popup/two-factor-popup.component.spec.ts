import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactorPopupComponent } from './two-factor-popup.component';

describe('TwoFactorPopupComponent', () => {
  let component: TwoFactorPopupComponent;
  let fixture: ComponentFixture<TwoFactorPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TwoFactorPopupComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

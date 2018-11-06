import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationMobilePopupComponent } from './registration-mobile-popup.component';

describe('RegistrationMobilePopupComponent', () => {
  let component: RegistrationMobilePopupComponent;
  let fixture: ComponentFixture<RegistrationMobilePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationMobilePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationMobilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

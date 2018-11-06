import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPopupMobileComponent } from './login-popup-mobile.component';

describe('LoginPopupMobileComponent', () => {
  let component: LoginPopupMobileComponent;
  let fixture: ComponentFixture<LoginPopupMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPopupMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPopupMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

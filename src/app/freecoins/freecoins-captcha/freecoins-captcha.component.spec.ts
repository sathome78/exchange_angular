import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecoinsCaptchaComponent } from './freecoins-captcha.component';

describe('FreecoinsCaptchaComponent', () => {
  let component: FreecoinsCaptchaComponent;
  let fixture: ComponentFixture<FreecoinsCaptchaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecoinsCaptchaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecoinsCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

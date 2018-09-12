import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsStepOneComponent } from './sms-step-one.component';

describe('SmsStepOneComponent', () => {
  let component: SmsStepOneComponent;
  let fixture: ComponentFixture<SmsStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

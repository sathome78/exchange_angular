import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsStepFourComponent } from './sms-step-four.component';

describe('SmsStepFourComponent', () => {
  let component: SmsStepFourComponent;
  let fixture: ComponentFixture<SmsStepFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsStepFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsStepFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

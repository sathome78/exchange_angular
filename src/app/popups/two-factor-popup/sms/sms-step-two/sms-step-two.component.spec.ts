import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsStepTwoComponent } from './sms-step-two.component';

describe('SmsStepTwoComponent', () => {
  let component: SmsStepTwoComponent;
  let fixture: ComponentFixture<SmsStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmsStepTwoComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

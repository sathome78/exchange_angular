import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsStepThreeComponent } from './sms-step-three.component';

describe('SmsStepThreeComponent', () => {
  let component: SmsStepThreeComponent;
  let fixture: ComponentFixture<SmsStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsStepThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

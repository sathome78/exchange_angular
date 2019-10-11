import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedKycMsgComponent } from './need-kyc-msg.component';

describe('NeedKycMsgComponent', () => {
  let component: NeedKycMsgComponent;
  let fixture: ComponentFixture<NeedKycMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedKycMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedKycMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

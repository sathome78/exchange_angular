import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendStepTwoComponent } from './send-step-two.component';

describe('SendStepTwoComponent', () => {
  let component: SendStepTwoComponent;
  let fixture: ComponentFixture<SendStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendStepTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

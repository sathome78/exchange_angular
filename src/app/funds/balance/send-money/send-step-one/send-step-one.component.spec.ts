import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendStepOneComponent } from './send-step-one.component';

describe('SendStepOneComponent', () => {
  let component: SendStepOneComponent;
  let fixture: ComponentFixture<SendStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

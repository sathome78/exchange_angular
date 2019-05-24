import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendStepThreeComponent } from './send-step-three.component';

describe('SendStepThreeComponent', () => {
  let component: SendStepThreeComponent;
  let fixture: ComponentFixture<SendStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendStepThreeComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

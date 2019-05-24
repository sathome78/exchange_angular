import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillStepTwoComponent } from './refill-step-two.component';

describe('RefillStepTwoComponent', () => {
  let component: RefillStepTwoComponent;
  let fixture: ComponentFixture<RefillStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RefillStepTwoComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

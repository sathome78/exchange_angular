import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillStepOneComponent } from './refill-step-one.component';

describe('RefillStepOneComponent', () => {
  let component: RefillStepOneComponent;
  let fixture: ComponentFixture<RefillStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefillStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

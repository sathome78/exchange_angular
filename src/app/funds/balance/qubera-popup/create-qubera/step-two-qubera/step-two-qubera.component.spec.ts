import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwoQuberaComponent } from './step-two-qubera.component';

describe('StepTwoQuberaComponent', () => {
  let component: StepTwoQuberaComponent;
  let fixture: ComponentFixture<StepTwoQuberaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepTwoQuberaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepTwoQuberaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

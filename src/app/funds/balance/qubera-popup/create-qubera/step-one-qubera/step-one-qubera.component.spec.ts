import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOneQuberaComponent } from './step-one-qubera.component';

describe('StepOneQuberaComponent', () => {
  let component: StepOneQuberaComponent;
  let fixture: ComponentFixture<StepOneQuberaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepOneQuberaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepOneQuberaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

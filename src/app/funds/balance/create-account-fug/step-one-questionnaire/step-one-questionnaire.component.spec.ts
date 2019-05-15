import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOneQuestionnaireComponent } from './step-one-questionnaire.component';

describe('StepOneQuestionnaireComponent', () => {
  let component: StepOneQuestionnaireComponent;
  let fixture: ComponentFixture<StepOneQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepOneQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepOneQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

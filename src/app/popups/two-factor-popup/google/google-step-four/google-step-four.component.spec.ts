import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleStepFourComponent } from './google-step-four.component';

describe('GoogleStepFourComponent', () => {
  let component: GoogleStepFourComponent;
  let fixture: ComponentFixture<GoogleStepFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleStepFourComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleStepFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

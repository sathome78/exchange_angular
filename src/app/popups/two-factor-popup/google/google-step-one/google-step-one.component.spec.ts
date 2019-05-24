import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleStepOneComponent } from './google-step-one.component';

describe('GoogleStepOneComponent', () => {
  let component: GoogleStepOneComponent;
  let fixture: ComponentFixture<GoogleStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleStepOneComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleStepTwoComponent } from './google-step-two.component';

describe('GoogleStepTwoComponent', () => {
  let component: GoogleStepTwoComponent;
  let fixture: ComponentFixture<GoogleStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleStepTwoComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

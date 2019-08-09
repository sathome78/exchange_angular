import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleStepThreeComponent } from './google-step-three.component';

describe('GoogleStepThreeComponent', () => {
  let component: GoogleStepThreeComponent;
  let fixture: ComponentFixture<GoogleStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleStepThreeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

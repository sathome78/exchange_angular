import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillStepThreeComponent } from './refill-step-three.component';

describe('RefillStepThreeComponent', () => {
  let component: RefillStepThreeComponent;
  let fixture: ComponentFixture<RefillStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RefillStepThreeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

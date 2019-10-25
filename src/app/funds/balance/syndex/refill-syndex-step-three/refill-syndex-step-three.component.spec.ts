import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillSyndexStepThreeComponent } from './refill-syndex-step-three.component';

describe('RefillSyndexStepThreeComponent', () => {
  let component: RefillSyndexStepThreeComponent;
  let fixture: ComponentFixture<RefillSyndexStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefillSyndexStepThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillSyndexStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

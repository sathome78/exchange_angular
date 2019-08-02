import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicInputDashboardComponent } from './dynamic-input-dashboard.component';

describe('DynamicInputDashboardComponent', () => {
  let component: DynamicInputDashboardComponent;
  let fixture: ComponentFixture<DynamicInputDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicInputDashboardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicInputDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

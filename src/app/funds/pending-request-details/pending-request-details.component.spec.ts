import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRequestDetailsComponent } from './pending-request-details.component';

describe('PendingRequestDetailsComponent', () => {
  let component: PendingRequestDetailsComponent;
  let fixture: ComponentFixture<PendingRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PendingRequestDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

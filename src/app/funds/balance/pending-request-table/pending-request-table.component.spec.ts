import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRequestTableComponent } from './pending-request-table.component';

describe('PendingRequestTableComponent', () => {
  let component: PendingRequestTableComponent;
  let fixture: ComponentFixture<PendingRequestTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PendingRequestTableComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRequestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

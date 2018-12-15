import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRequestInfoComponent } from './pending-request-info.component';

describe('PendingRequestInfoComponent', () => {
  let component: PendingRequestInfoComponent;
  let fixture: ComponentFixture<PendingRequestInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingRequestInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRequestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

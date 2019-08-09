import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRequestMobComponent } from './pending-request-mob.component';

describe('PendingRequestMobComponent', () => {
  let component: PendingRequestMobComponent;
  let fixture: ComponentFixture<PendingRequestMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PendingRequestMobComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRequestMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNotificationReportComponent } from './top-notification-report.component';

describe('TopNotificationReportComponent', () => {
  let component: TopNotificationReportComponent;
  let fixture: ComponentFixture<TopNotificationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopNotificationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNotificationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

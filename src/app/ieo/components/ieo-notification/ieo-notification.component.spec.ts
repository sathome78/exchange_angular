import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IEONotificationComponent } from './ieo-notification.component';

describe('IEONotificationComponent', () => {
  let component: IEONotificationComponent;
  let fixture: ComponentFixture<IEONotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IEONotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IEONotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

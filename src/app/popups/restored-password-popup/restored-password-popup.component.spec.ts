import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoredPasswordPopupComponent } from './restored-password-popup.component';

describe('RestoredPasswordPopupComponent', () => {
  let component: RestoredPasswordPopupComponent;
  let fixture: ComponentFixture<RestoredPasswordPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RestoredPasswordPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoredPasswordPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyRestoredPasswordPopupComponent } from './already-restored-password-popup.component';

describe('AlreadyRestoredPasswordPopupComponent', () => {
  let component: AlreadyRestoredPasswordPopupComponent;
  let fixture: ComponentFixture<AlreadyRestoredPasswordPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlreadyRestoredPasswordPopupComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlreadyRestoredPasswordPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

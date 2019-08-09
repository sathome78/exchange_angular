import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityPopupComponent } from './identity-popup.component';

describe('IdentityPopupComponent', () => {
  let component: IdentityPopupComponent;
  let fixture: ComponentFixture<IdentityPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IdentityPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

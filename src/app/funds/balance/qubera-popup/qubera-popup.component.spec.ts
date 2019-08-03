import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuberaPopupComponent } from './qubera-popup.component';

describe('QuberaPopupComponent', () => {
  let component: QuberaPopupComponent;
  let fixture: ComponentFixture<QuberaPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuberaPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuberaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

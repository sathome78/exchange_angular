import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouPopupComponent } from './thank-you-popup.component';

describe('ThankYouPopupComponent', () => {
  let component: ThankYouPopupComponent;
  let fixture: ComponentFixture<ThankYouPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankYouPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankYouPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

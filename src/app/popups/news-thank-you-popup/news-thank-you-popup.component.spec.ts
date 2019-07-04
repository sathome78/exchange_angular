import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsThankYouPopupComponent } from './news-thank-you-popup.component';

describe('NewsThankYouPopupComponent', () => {
  let component: NewsThankYouPopupComponent;
  let fixture: ComponentFixture<NewsThankYouPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsThankYouPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsThankYouPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

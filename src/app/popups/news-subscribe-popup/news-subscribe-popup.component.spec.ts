import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSubscribePopupComponent } from './news-subscribe-popup.component';

describe('NewsSubscribePopupComponent', () => {
  let component: NewsSubscribePopupComponent;
  let fixture: ComponentFixture<NewsSubscribePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsSubscribePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsSubscribePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReadyBannerComponent } from './get-ready-banner.component';

describe('GetReadyBannerComponent', () => {
  let component: GetReadyBannerComponent;
  let fixture: ComponentFixture<GetReadyBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GetReadyBannerComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetReadyBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

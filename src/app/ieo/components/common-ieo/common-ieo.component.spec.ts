import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonIEOComponent } from './common-ieo.component';

describe('CommonIEOComponent', () => {
  let component: CommonIEOComponent;
  let fixture: ComponentFixture<CommonIEOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonIEOComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonIEOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

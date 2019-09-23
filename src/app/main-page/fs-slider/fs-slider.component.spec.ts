import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FsSliderComponent } from './fs-slider.component';

describe('FsSliderComponent', () => {
  let component: FsSliderComponent;
  let fixture: ComponentFixture<FsSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FsSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

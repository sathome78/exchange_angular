import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IeoDescriptionWrapperComponent } from './ieo-description-wrapper.component';

describe('IeoDescriptionWrapperComponent', () => {
  let component: IeoDescriptionWrapperComponent;
  let fixture: ComponentFixture<IeoDescriptionWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IeoDescriptionWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IeoDescriptionWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

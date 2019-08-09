import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IeoDescription2Component } from './ieo-description2.component';

describe('IeoDescription2Component', () => {
  let component: IeoDescription2Component;
  let fixture: ComponentFixture<IeoDescription2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IeoDescription2Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IeoDescription2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

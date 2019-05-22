import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IeoDescription4Component } from './ieo-description4.component';

describe('IeoDescription4Component', () => {
  let component: IeoDescription4Component;
  let fixture: ComponentFixture<IeoDescription4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IeoDescription4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IeoDescription4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

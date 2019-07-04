import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IeoDescription3Component } from './ieo-description3.component';

describe('IeoDescription3Component', () => {
  let component: IeoDescription3Component;
  let fixture: ComponentFixture<IeoDescription3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IeoDescription3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IeoDescription3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

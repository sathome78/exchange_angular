import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IEOComponent } from './ieo.component';

describe('IEOComponent', () => {
  let component: IEOComponent;
  let fixture: ComponentFixture<IEOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IEOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IEOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

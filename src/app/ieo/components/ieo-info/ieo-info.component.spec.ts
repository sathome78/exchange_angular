import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IeoInfoComponent } from './ieo-info.component';

describe('IeoInfoComponent', () => {
  let component: IeoInfoComponent;
  let fixture: ComponentFixture<IeoInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IeoInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IeoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

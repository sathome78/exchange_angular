import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IeoHeaderComponent } from './ieo-header.component';

describe('IeoHeaderComponent', () => {
  let component: IeoHeaderComponent;
  let fixture: ComponentFixture<IeoHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IeoHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IeoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

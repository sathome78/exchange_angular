import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IEORequirementsComponent } from './ieo-requirements.component';

describe('IEORequirementsComponent', () => {
  let component: IEORequirementsComponent;
  let fixture: ComponentFixture<IEORequirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IEORequirementsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IEORequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

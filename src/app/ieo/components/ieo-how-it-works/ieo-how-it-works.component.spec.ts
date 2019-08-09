import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IEOHowItWorksComponent } from './ieo-how-it-works.component';

describe('IEOHowItWorksComponent', () => {
  let component: IEOHowItWorksComponent;
  let fixture: ComponentFixture<IEOHowItWorksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IEOHowItWorksComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IEOHowItWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

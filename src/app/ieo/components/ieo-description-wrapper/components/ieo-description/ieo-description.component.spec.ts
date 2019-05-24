import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IEODescriptionComponent } from './ieo-description.component';

describe('IEODescriptionComponent', () => {
  let component: IEODescriptionComponent;
  let fixture: ComponentFixture<IEODescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IEODescriptionComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IEODescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

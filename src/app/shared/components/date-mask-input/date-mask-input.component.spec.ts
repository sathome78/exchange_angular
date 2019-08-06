import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateMaskInputComponent } from './date-mask-input.component';

describe('DateMaskInputComponent', () => {
  let component: DateMaskInputComponent;
  let fixture: ComponentFixture<DateMaskInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DateMaskInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateMaskInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayMaskInputComponent } from './birthday-mask-input.component';

describe('BirthdayMaskInputComponent', () => {
  let component: BirthdayMaskInputComponent;
  let fixture: ComponentFixture<BirthdayMaskInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BirthdayMaskInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthdayMaskInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

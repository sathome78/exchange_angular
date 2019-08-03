import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramStepOneComponent } from './telegram-step-one.component';

describe('TelegramStepOneComponent', () => {
  let component: TelegramStepOneComponent;
  let fixture: ComponentFixture<TelegramStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TelegramStepOneComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

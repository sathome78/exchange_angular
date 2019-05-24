import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramStepTwoComponent } from './telegram-step-two.component';

describe('TelegramStepTwoComponent', () => {
  let component: TelegramStepTwoComponent;
  let fixture: ComponentFixture<TelegramStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TelegramStepTwoComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

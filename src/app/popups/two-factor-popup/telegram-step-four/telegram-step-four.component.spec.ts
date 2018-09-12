import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramStepFourComponent } from './telegram-step-four.component';

describe('TelegramStepFourComponent', () => {
  let component: TelegramStepFourComponent;
  let fixture: ComponentFixture<TelegramStepFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelegramStepFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramStepFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

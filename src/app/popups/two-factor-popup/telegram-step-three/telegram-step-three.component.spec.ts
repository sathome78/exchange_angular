import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramStepThreeComponent } from './telegram-step-three.component';

describe('TelegramStepThreeComponent', () => {
  let component: TelegramStepThreeComponent;
  let fixture: ComponentFixture<TelegramStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelegramStepThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

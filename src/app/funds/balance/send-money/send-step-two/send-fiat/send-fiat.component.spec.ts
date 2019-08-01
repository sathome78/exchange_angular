import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFiatComponent } from './send-fiat.component';

describe('SendFiatComponent', () => {
  let component: SendFiatComponent;
  let fixture: ComponentFixture<SendFiatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendFiatComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFiatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

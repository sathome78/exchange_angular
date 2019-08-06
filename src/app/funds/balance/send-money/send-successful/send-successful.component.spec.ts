import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendSuccessfulComponent } from './send-successful.component';

describe('SendSuccessfulComponent', () => {
  let component: SendSuccessfulComponent;
  let fixture: ComponentFixture<SendSuccessfulComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendSuccessfulComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTfaComponent } from './send-tfa.component';

describe('SendTfaComponent', () => {
  let component: SendTfaComponent;
  let fixture: ComponentFixture<SendTfaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendTfaComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendTfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

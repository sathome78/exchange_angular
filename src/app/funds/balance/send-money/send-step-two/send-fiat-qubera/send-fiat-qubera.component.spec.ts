import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFiatQuberaComponent } from './send-fiat-qubera.component';

describe('SendFiatQuberaComponent', () => {
  let component: SendFiatQuberaComponent;
  let fixture: ComponentFixture<SendFiatQuberaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendFiatQuberaComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFiatQuberaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

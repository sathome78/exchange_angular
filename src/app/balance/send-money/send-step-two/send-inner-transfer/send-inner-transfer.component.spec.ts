import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendInnerTransferComponent } from './send-inner-transfer.component';

describe('SendInnerTransferComponent', () => {
  let component: SendInnerTransferComponent;
  let fixture: ComponentFixture<SendInnerTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendInnerTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendInnerTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillInnerTransferComponent } from './refill-inner-transfer.component';

describe('RefillInnerTransferComponent', () => {
  let component: RefillInnerTransferComponent;
  let fixture: ComponentFixture<RefillInnerTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefillInnerTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillInnerTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

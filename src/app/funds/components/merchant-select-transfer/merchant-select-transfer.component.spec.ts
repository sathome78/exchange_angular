import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantSelectTransferComponent } from './merchant-select-transfer.component';

describe('MerchantSelectTransferComponent', () => {
  let component: MerchantSelectTransferComponent;
  let fixture: ComponentFixture<MerchantSelectTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantSelectTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantSelectTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

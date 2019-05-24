import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferInstantComponent } from './transfer-instant.component';

describe('TransferInstantComponent', () => {
  let component: TransferInstantComponent;
  let fixture: ComponentFixture<TransferInstantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransferInstantComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferInstantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferProtectedEmailCodeComponent } from './transfer-protected-email-code.component';

describe('TransferProtectedEmailCodeComponent', () => {
  let component: TransferProtectedEmailCodeComponent;
  let fixture: ComponentFixture<TransferProtectedEmailCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferProtectedEmailCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferProtectedEmailCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

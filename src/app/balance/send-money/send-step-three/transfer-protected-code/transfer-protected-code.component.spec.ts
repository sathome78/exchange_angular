import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferProtectedCodeComponent } from './transfer-protected-code.component';

describe('TransferProtectedCodeComponent', () => {
  let component: TransferProtectedCodeComponent;
  let fixture: ComponentFixture<TransferProtectedCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferProtectedCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferProtectedCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

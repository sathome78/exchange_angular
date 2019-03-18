import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferQuberaComponent } from './transfer-qubera.component';

describe('TransferQuberaComponent', () => {
  let component: TransferQuberaComponent;
  let fixture: ComponentFixture<TransferQuberaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferQuberaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferQuberaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

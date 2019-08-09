import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillFiatQuberaComponent } from './refill-fiat-qubera.component';

describe('RefillFiatQuberaComponent', () => {
  let component: RefillFiatQuberaComponent;
  let fixture: ComponentFixture<RefillFiatQuberaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RefillFiatQuberaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillFiatQuberaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

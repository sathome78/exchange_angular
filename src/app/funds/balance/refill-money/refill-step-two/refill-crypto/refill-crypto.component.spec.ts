import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillCryptoComponent } from './refill-crypto.component';

describe('RefillCryptoComponent', () => {
  let component: RefillCryptoComponent;
  let fixture: ComponentFixture<RefillCryptoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RefillCryptoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillCryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

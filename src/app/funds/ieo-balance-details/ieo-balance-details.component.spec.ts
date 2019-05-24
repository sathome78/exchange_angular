import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IEOBalanceDetailsComponent } from './ieo-balance-details.component';

describe('IEOBalanceDetailsComponent', () => {
  let component: IEOBalanceDetailsComponent;
  let fixture: ComponentFixture<IEOBalanceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IEOBalanceDetailsComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IEOBalanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

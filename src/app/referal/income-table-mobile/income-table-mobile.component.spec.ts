import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeTableMobileComponent } from './income-table-mobile.component';

describe('IncomeTableMobileComponent', () => {
  let component: IncomeTableMobileComponent;
  let fixture: ComponentFixture<IncomeTableMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeTableMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeTableMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

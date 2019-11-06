import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureTableMobileComponent } from './structure-table-mobile.component';

describe('StructureTableMobileComponent', () => {
  let component: StructureTableMobileComponent;
  let fixture: ComponentFixture<StructureTableMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureTableMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureTableMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

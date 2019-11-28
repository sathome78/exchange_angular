import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureTableMobileItemComponent } from './structure-table-mobile-item.component';

describe('StructureTableMobileItemComponent', () => {
  let component: StructureTableMobileItemComponent;
  let fixture: ComponentFixture<StructureTableMobileItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureTableMobileItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureTableMobileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

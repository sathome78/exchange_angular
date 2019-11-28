import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureTableItemComponent } from './structure-table-item.component';

describe('StructureTableItemComponent', () => {
  let component: StructureTableItemComponent;
  let fixture: ComponentFixture<StructureTableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureTableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

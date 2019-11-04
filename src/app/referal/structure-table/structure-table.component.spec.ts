import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureTableComponent } from './structure-table.component';

describe('StructureTableComponent', () => {
  let component: StructureTableComponent;
  let fixture: ComponentFixture<StructureTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

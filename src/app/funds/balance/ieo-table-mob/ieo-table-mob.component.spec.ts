import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IEOTableMobComponent } from './ieo-table-mob.component';

describe('IEOTableMobComponent', () => {
  let component: IEOTableMobComponent;
  let fixture: ComponentFixture<IEOTableMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IEOTableMobComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IEOTableMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

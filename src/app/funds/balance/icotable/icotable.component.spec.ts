import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ICOTableComponent } from './icotable.component';

describe('ICOTableComponent', () => {
  let component: ICOTableComponent;
  let fixture: ComponentFixture<ICOTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ICOTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ICOTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

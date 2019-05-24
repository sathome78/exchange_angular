import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IEOTableComponent } from './ieotable.component';

describe('IEOTableComponent', () => {
  let component: IEOTableComponent;
  let fixture: ComponentFixture<IEOTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IEOTableComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IEOTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

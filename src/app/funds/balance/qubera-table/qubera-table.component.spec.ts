import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuberaTableComponent } from './qubera-table.component';

describe('QuberaTableComponent', () => {
  let component: QuberaTableComponent;
  let fixture: ComponentFixture<QuberaTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuberaTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuberaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

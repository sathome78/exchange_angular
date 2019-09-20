import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunLineComponent } from './run-line.component';

describe('RunLineComponent', () => {
  let component: RunLineComponent;
  let fixture: ComponentFixture<RunLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

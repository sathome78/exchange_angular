import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendLinesComponent } from './send-lines.component';

describe('SendLinesComponent', () => {
  let component: SendLinesComponent;
  let fixture: ComponentFixture<SendLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

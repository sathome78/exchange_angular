import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefHowMuchComponent } from './ref-how-much.component';

describe('RefHowMuchComponent', () => {
  let component: RefHowMuchComponent;
  let fixture: ComponentFixture<RefHowMuchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefHowMuchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefHowMuchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

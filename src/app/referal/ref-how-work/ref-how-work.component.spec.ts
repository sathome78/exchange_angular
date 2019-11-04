import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefHowWorkComponent } from './ref-how-work.component';

describe('RefHowWorkComponent', () => {
  let component: RefHowWorkComponent;
  let fixture: ComponentFixture<RefHowWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefHowWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefHowWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

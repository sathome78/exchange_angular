import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheatingInputComponent } from './cheating-input.component';

describe('CheatingInputComponent', () => {
  let component: CheatingInputComponent;
  let fixture: ComponentFixture<CheatingInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheatingInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheatingInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillSuccessfulComponent } from './refill-successful.component';

describe('RefillSuccessfulComponent', () => {
  let component: RefillSuccessfulComponent;
  let fixture: ComponentFixture<RefillSuccessfulComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefillSuccessfulComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

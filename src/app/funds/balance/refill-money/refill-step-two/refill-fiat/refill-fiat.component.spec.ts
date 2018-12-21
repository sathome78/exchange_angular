import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillFiatComponent } from './refill-fiat.component';

describe('RefillFiatComponent', () => {
  let component: RefillFiatComponent;
  let fixture: ComponentFixture<RefillFiatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefillFiatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillFiatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

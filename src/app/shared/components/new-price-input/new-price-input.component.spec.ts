import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPriceInputComponent } from './new-price-input.component';

describe('NewPriceInputComponent', () => {
  let component: NewPriceInputComponent;
  let fixture: ComponentFixture<NewPriceInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPriceInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPriceInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSearchInputComponent } from './custom-search-input.component';

describe('CustomSearchInputComponent', () => {
  let component: CustomSearchInputComponent;
  let fixture: ComponentFixture<CustomSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomSearchInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

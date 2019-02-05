import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactThankComponent } from './contact-thank.component';

describe('ContactThankComponent', () => {
  let component: ContactThankComponent;
  let fixture: ComponentFixture<ContactThankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactThankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactThankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

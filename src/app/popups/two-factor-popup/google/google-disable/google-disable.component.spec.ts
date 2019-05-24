import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleDisableComponent } from './google-disable.component';

describe('GoogleDisableComponent', () => {
  let component: GoogleDisableComponent;
  let fixture: ComponentFixture<GoogleDisableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleDisableComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleDisableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

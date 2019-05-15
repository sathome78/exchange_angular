import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountFugComponent } from './create-account-fug.component';

describe('CreateAccountFugComponent', () => {
  let component: CreateAccountFugComponent;
  let fixture: ComponentFixture<CreateAccountFugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountFugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountFugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

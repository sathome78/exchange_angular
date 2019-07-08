import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFugComponent } from './create-fug.component';

describe('CreateFugComponent', () => {
  let component: CreateFugComponent;
  let fixture: ComponentFixture<CreateFugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

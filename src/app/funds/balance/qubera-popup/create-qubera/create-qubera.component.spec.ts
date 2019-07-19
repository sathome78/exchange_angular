import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuberaComponent } from './create-qubera.component';

describe('CreateQuberaComponent', () => {
  let component: CreateQuberaComponent;
  let fixture: ComponentFixture<CreateQuberaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuberaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuberaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

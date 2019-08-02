import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuberaMobDetailsComponent } from './qubera-mob-details.component';

describe('QuberaMobDetailsComponent', () => {
  let component: QuberaMobDetailsComponent;
  let fixture: ComponentFixture<QuberaMobDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuberaMobDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuberaMobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

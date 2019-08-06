import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuberaMobComponent } from './qubera-mob.component';

describe('QuberaMobComponent', () => {
  let component: QuberaMobComponent;
  let fixture: ComponentFixture<QuberaMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuberaMobComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuberaMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomFormComponent } from './bottom-form.component';

describe('BottomFormComponent', () => {
  let component: BottomFormComponent;
  let fixture: ComponentFixture<BottomFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

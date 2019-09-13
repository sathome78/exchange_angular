import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecoinsComponent } from './freecoins.component';

describe('FreecoinsComponent', () => {
  let component: FreecoinsComponent;
  let fixture: ComponentFixture<FreecoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

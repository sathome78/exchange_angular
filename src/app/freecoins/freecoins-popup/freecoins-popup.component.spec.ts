import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecoinsPopupComponent } from './freecoins-popup.component';

describe('FreecoinsPopupComponent', () => {
  let component: FreecoinsPopupComponent;
  let fixture: ComponentFixture<FreecoinsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecoinsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecoinsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

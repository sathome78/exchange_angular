import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketsHomeComponent } from './markets-home.component';

describe('MarketsHomeComponent', () => {
  let component: MarketsHomeComponent;
  let fixture: ComponentFixture<MarketsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

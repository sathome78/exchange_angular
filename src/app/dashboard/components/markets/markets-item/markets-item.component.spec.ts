import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketsItemComponent } from './markets-item.component';

describe('MarketsItemComponent', () => {
  let component: MarketsItemComponent;
  let fixture: ComponentFixture<MarketsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketsItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

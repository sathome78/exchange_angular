import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageItemsDropdownComponent } from './page-items-dropdown.component';

describe('PageItemDropdownComponent', () => {
  let component: PageItemsDropdownComponent;
  let fixture: ComponentFixture<PageItemsDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageItemsDropdownComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageItemsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

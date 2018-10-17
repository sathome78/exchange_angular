import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcoSearchComponent } from './ico-search.component';

describe('IcoSearchComponent', () => {
  let component: IcoSearchComponent;
  let fixture: ComponentFixture<IcoSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcoSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndexCountriesSelectorComponent } from './syndex-countries-selector.component';

describe('SyndexCountriesSelectorComponent', () => {
  let component: SyndexCountriesSelectorComponent;
  let fixture: ComponentFixture<SyndexCountriesSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyndexCountriesSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndexCountriesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

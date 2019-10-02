import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndexInfoComponent } from './syndex-info.component';

describe('SyndexInfoComponent', () => {
  let component: SyndexInfoComponent;
  let fixture: ComponentFixture<SyndexInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyndexInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndexInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

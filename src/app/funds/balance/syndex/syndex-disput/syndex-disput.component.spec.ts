import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndexDisputComponent } from './syndex-disput.component';

describe('SyndexDisputComponent', () => {
  let component: SyndexDisputComponent;
  let fixture: ComponentFixture<SyndexDisputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyndexDisputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndexDisputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

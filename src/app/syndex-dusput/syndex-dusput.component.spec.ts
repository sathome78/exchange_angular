import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndexDusputComponent } from './syndex-dusput.component';

describe('SyndexDusputComponent', () => {
  let component: SyndexDusputComponent;
  let fixture: ComponentFixture<SyndexDusputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyndexDusputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndexDusputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

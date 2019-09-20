import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoGraficsComponent } from './info-grafics.component';

describe('InfoGraficsComponent', () => {
  let component: InfoGraficsComponent;
  let fixture: ComponentFixture<InfoGraficsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoGraficsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoGraficsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

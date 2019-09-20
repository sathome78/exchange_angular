import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicLinksComponent } from './graphic-links.component';

describe('GraphicLinksComponent', () => {
  let component: GraphicLinksComponent;
  let fixture: ComponentFixture<GraphicLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

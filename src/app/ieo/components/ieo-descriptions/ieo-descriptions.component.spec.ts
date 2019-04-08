import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IEODescriptionsComponent } from './ieo-descriptions.component';

describe('IEODescriptionsComponent', () => {
  let component: IEODescriptionsComponent;
  let fixture: ComponentFixture<IEODescriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IEODescriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IEODescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

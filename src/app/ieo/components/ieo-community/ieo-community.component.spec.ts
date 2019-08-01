import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IeoCommunityComponent } from './ieo-community.component';

describe('IeoCommunityComponent', () => {
  let component: IeoCommunityComponent;
  let fixture: ComponentFixture<IeoCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IeoCommunityComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IeoCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

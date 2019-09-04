import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomPolicyComponent } from './dom-policy.component';

describe('DomPolicyComponent', () => {
  let component: DomPolicyComponent;
  let fixture: ComponentFixture<DomPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

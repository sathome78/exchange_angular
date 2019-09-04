import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtaoPolicyComponent } from './etao-policy.component';

describe('EtaoPolicyComponent', () => {
  let component: EtaoPolicyComponent;
  let fixture: ComponentFixture<EtaoPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtaoPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtaoPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

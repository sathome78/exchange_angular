import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyCreatedComponent } from './api-key-created.component';

describe('ApiKeyCreatedComponent', () => {
  let component: ApiKeyCreatedComponent;
  let fixture: ComponentFixture<ApiKeyCreatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiKeyCreatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiKeyCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

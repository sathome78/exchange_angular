import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayChatComponent } from './day-chat.component';

describe('DayChatComponent', () => {
  let component: DayChatComponent;
  let fixture: ComponentFixture<DayChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

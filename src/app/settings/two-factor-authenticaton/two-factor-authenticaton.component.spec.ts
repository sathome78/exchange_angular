import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactorAuthenticatonComponent } from './two-factor-authenticaton.component';

describe('TwoFactorAuthenticatonComponent', () => {
  let component: TwoFactorAuthenticatonComponent;
  let fixture: ComponentFixture<TwoFactorAuthenticatonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoFactorAuthenticatonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorAuthenticatonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

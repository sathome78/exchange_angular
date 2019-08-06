import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuberaPopupsComponent } from './qubera-popups.component';

describe('QuberaPopupsComponent', () => {
  let component: QuberaPopupsComponent;
  let fixture: ComponentFixture<QuberaPopupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuberaPopupsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuberaPopupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

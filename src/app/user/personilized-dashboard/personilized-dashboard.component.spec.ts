import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonilizedDashboardComponent } from './personilized-dashboard.component';

describe('PersonilizedDashboardComponent', () => {
  let component: PersonilizedDashboardComponent;
  let fixture: ComponentFixture<PersonilizedDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonilizedDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonilizedDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

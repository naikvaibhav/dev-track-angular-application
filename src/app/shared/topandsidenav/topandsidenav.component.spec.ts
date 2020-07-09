import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopandsidenavComponent } from './topandsidenav.component';

describe('TopandsidenavComponent', () => {
  let component: TopandsidenavComponent;
  let fixture: ComponentFixture<TopandsidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopandsidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopandsidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

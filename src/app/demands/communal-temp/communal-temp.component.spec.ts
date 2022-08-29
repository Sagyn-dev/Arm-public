import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunalTempComponent } from './communal-temp.component';

describe('CommunalTempComponent', () => {
  let component: CommunalTempComponent;
  let fixture: ComponentFixture<CommunalTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunalTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunalTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

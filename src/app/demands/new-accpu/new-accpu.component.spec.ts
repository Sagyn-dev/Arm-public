import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAccpuComponent } from './new-accpu.component';

describe('NewAccpuComponent', () => {
  let component: NewAccpuComponent;
  let fixture: ComponentFixture<NewAccpuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAccpuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAccpuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

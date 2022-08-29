import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenAccpuComponent } from './ren-accpu.component';

describe('RenAccpuComponent', () => {
  let component: RenAccpuComponent;
  let fixture: ComponentFixture<RenAccpuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenAccpuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenAccpuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

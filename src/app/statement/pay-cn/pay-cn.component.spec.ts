import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayCnComponent } from './pay-cn.component';

describe('PayCnComponent', () => {
  let component: PayCnComponent;
  let fixture: ComponentFixture<PayCnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayCnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayCnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

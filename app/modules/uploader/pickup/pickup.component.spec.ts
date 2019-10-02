import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupComponent } from './pickup.component';

describe('PickupComponent', () => {
  let component: PickupComponent;
  let fixture: ComponentFixture<PickupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

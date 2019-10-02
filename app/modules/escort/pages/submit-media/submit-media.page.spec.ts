import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitMediaPage } from './submit-media.page';

describe('SubmitMediaPage', () => {
  let component: SubmitMediaPage;
  let fixture: ComponentFixture<SubmitMediaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitMediaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

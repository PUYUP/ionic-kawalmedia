import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMediaPage } from './list-media.page';

describe('ListMediaPage', () => {
  let component: ListMediaPage;
  let fixture: ComponentFixture<ListMediaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMediaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

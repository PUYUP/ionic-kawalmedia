import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMediaPage } from './detail-media.page';

describe('DetailMediaPage', () => {
  let component: DetailMediaPage;
  let fixture: ComponentFixture<DetailMediaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailMediaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

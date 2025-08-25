import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestNew } from './request-new';

describe('RequestNew', () => {
  let component: RequestNew;
  let fixture: ComponentFixture<RequestNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestNew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestNew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

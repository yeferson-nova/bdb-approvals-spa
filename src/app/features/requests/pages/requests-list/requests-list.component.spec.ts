import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsList } from './requests-list';

describe('RequestsList', () => {
  let component: RequestsList;
  let fixture: ComponentFixture<RequestsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

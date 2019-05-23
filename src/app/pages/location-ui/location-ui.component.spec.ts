import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationUiComponent } from './location-ui.component';

describe('LocationUiComponent', () => {
  let component: LocationUiComponent;
  let fixture: ComponentFixture<LocationUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

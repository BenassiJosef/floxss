import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFooterComponent } from './order-footer.component';

describe('OrderFooterComponent', () => {
  let component: OrderFooterComponent;
  let fixture: ComponentFixture<OrderFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

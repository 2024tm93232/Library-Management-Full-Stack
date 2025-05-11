import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeBookComponent } from './exchange-book.component';

describe('ExchangeBookComponent', () => {
  let component: ExchangeBookComponent;
  let fixture: ComponentFixture<ExchangeBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

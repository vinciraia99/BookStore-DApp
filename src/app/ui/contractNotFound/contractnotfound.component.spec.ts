import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContractNotFoundComponent} from './contractnotfound.component';

describe('ContractNotFoundComponent', () => {
  let component: ContractNotFoundComponent;
  let fixture: ComponentFixture<ContractNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractNotFoundComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

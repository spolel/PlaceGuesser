import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePagedComponent } from './table-paged.component';

describe('TablePagedComponent', () => {
  let component: TablePagedComponent;
  let fixture: ComponentFixture<TablePagedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablePagedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablePagedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

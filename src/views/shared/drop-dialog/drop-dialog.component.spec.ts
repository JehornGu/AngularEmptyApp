import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDialogComponent } from './drop-dialog.component';

describe('DropDialogComponent', () => {
  let component: DropDialogComponent;
  let fixture: ComponentFixture<DropDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

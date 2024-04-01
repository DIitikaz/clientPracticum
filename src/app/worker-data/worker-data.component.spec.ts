import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerDataComponent } from './worker-data.component';

describe('WorkerDataComponent', () => {
  let component: WorkerDataComponent;
  let fixture: ComponentFixture<WorkerDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

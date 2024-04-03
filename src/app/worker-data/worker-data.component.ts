import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkerService } from '../workers.service';
import { Worker } from '../worker.model';
import { MatDialog } from '@angular/material/dialog';
import { EditWorkerComponent } from '../edit-worker/edit-worker.component'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon'
import { identity } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AddWorkerComponent } from '../add-worker/add-worker.component';

@Component({
    selector: 'app-worker-data',
    standalone: true,
    imports: [DecimalPipe, FormsModule, NgbTypeaheadModule, NgbPaginationModule, MatIconModule, CommonModule,MatDatepickerModule],
    templateUrl: './worker-data.component.html',
    styleUrl: './worker-data.component.scss',
})
export class WorkerDataComponent {
    page = 1;
    pageSize = 4;
    workers: Worker[] = [];
    workersDisplay: Worker[] = [];
    collectionSize = this.workers.length;
    isHovered: boolean[] = [];

    constructor(private workerService: WorkerService,private router:Router ,private route:ActivatedRoute ,public dialog: MatDialog) {
        this.refreshWorkers();
        this.workerService.getWorkers().subscribe({
            next: (res) => {
                this.workers = res;
                this.collectionSize = res.length;
                this.workersDisplay = res;
            }
        });
    }
    addWorker(){
        const dialogRef = this.dialog.open(AddWorkerComponent,  {
          width: '750px',height:'600px'
         
        }); 
    }
    deleteWorker(worker: Worker) {
       this.workerService.delateWorker(worker.workerId).subscribe({
        next:(res)=>{
          console.log("deletework")
        },
        error:(err)=> {
          console.log("delete not work")
        },
       })
    }

    editWorker(worker: Worker) {
    //   this.router.navigate(['/edit'],{queryParams:{id:worker.workerId}}) 
    

    const dialogRef = this.dialog.open(EditWorkerComponent,  {
        data: { id: worker.workerId},
      width: '750px',height:'600px'
     
    }); 
    }

    refreshWorkers() {
        this.workersDisplay = this.workers.map((worker, i) => ({ id: i + 1, ...worker })).slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
        );
    }

    showIcons(index: number) {
        this.isHovered[index] = true;
    }

    hideIcons(index: number) {
        this.isHovered[index] = false;
    }
}

import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Worker } from './worker.model';
import { WorkerForEdit } from './workerforEdit.model';

@Injectable({ providedIn: 'root' })
export class WorkerService {

  public workers: Worker[] = []


  constructor(private http: HttpClient) { }

  getWorkers(): Observable<Worker[]> {
    return this.http.get<Worker[]>('https://localhost:7268/api/Worker')
  }
  delateWorker(workerId: string): Observable<any> {
    return this.http.delete(`https://localhost:7268/api/Worker/${workerId}`)
  }
  getByIdWorker(workerId: string): Observable<WorkerForEdit> {
    return this.http.get<WorkerForEdit>(`https://localhost:7268/api/Worker/${workerId}`)
  }
  PostWorker(WorkerForEdit: WorkerForEdit): Observable<WorkerForEdit> {
    return this.http.post<WorkerForEdit>(`https://localhost:7268/api/Worker`,WorkerForEdit)
  }
  PutWorker(WorkerForEdit: WorkerForEdit): Observable<WorkerForEdit> {
    console.log('https://localhost:7268/api/Worker/'+WorkerForEdit.workerId)
    return this.http.put<WorkerForEdit>('https://localhost:7268/api/Worker/'+WorkerForEdit.workerId,WorkerForEdit)
  }
}
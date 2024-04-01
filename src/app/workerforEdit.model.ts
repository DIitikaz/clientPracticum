import { WorkerRole } from "./workerRole.model "

export class WorkerForEdit{

    workerId!:string
    firstName!:string
    lastName!:string
    start_of_work_date!:Date
    gender!:boolean
    status!:boolean
    roles!:WorkerRole[]

}
// public DateTime Date_Born { get; set; }


import { Component, OnInit } from '@angular/core';
import { WorkerForEdit } from '../workerforEdit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerService } from '../workers.service';
import {  Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CommonModule, formatDate } from '@angular/common';
import { RoleName } from '../RoleName.model';
import { RolesNameService } from '../roles-name.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon'
@Component({
  selector: 'app-add-worker',
  standalone: true,
  imports: [MatIconModule, CommonModule,MatCheckboxModule,MatSelectModule,MatDialogModule,MatButtonModule,MatInputModule,FormsModule,ReactiveFormsModule,MatDatepickerModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' } // Use the desired locale
  ],
  templateUrl: './add-worker.component.html',
  styleUrl: './add-worker.component.scss'
})
export class AddWorkerComponent implements OnInit {
  genderOptions = [
    { value: true, label: 'זכר' },
    { value: false, label: 'נקבה' }
  ]
  addWorkerForm!: FormGroup;
 rolesName!:RoleName[]
 constructor(
  @Inject(MAT_DIALOG_DATA) 
  private workerService: WorkerService,
  private roleNameService: RolesNameService,
  public dialogRef: MatDialogRef<AddWorkerComponent>,
  private fb: FormBuilder
) {
  this.addWorkerForm = this.fb.group({
    workerId: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    firstName: [null, [Validators.required, Validators.minLength(2)]],
    lastName: [null, [Validators.required, Validators.minLength(2)]],
    start_of_work_date: [null, Validators.required],
    gender: [null, Validators.required],
    roles: this.fb.array([])
  });
}
get roles(){
  return this.addWorkerForm.get("roles") as FormArray
  }
ngOnInit(): void {
  this.roleNameService.getRolesName().subscribe({
    next: (res) => this.rolesName = res
  });
}


dateAfterStartValidator() {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    return new Promise((resolve) => {
      const entryDate = new Date(control.value);
      const startDate = new Date(this.addWorkerForm.get('start_of_work_date')?.value);

      setTimeout(() => { // Simulating an asynchronous operation with setTimeout
        entryDate.setHours(23, 59, 59, 999);

        // If entry date is before start date or after the end of the start date, return error
        if (entryDate < startDate || entryDate.getTime() > startDate.getTime() + 86399000) { // 86399000 ms is almost 24 hours
          resolve({ dateAfterStart: true });
        } else {
          resolve(null);
        }
      }, 0);
    });
  };
}
onSubmit(){
console.log(this.addWorkerForm.value);
this.workerService.PutWorker(this.addWorkerForm.value).subscribe({next:(res)=>console.log("putSucsses")})
}
  removeRole(index: number) {
    const rolesArray = this.addWorkerForm.get('roles') as FormArray;
    rolesArray.removeAt(index);
  }

  addRole() {
    const role = this.fb.group({
      roleNameId: ['', Validators.required],
      date_of_entry_into_office: [new Date(), [Validators.required,]],
      Managerial: [false, Validators.required]
    });
    const rolesFormGroup = this.addWorkerForm.get('roles') as FormArray;
    rolesFormGroup.push(role);

    const lastIndex = rolesFormGroup.length - 1;
    rolesFormGroup.at(lastIndex).get('date_of_entry_into_office')?.setAsyncValidators(this.dateAfterStartValidator());
  }}




  

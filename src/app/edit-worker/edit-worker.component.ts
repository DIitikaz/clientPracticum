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
  selector: 'app-edit-worker',
  standalone: true,
  imports: [MatIconModule, CommonModule,MatCheckboxModule,MatSelectModule,MatDialogModule,MatButtonModule,MatInputModule,FormsModule,ReactiveFormsModule,MatDatepickerModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' } // Use the desired locale
  ],
  templateUrl: './edit-worker.component.html',
  styleUrl: './edit-worker.component.scss'
})
export class EditWorkerComponent implements OnInit {
  genderOptions = [
    { value: true, label: 'זכר' },
    { value: false, label: 'נקבה' }
  ]
  editWorkerForm!: FormGroup;
  workerForEdit!: WorkerForEdit;
 rolesName!:RoleName[]
 constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private workerService: WorkerService,
  private roleNameService: RolesNameService,
  public dialogRef: MatDialogRef<EditWorkerComponent>,
  private fb: FormBuilder
) {
  this.editWorkerForm = this.fb.group({
    workerId: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    firstName: [null, [Validators.required, Validators.minLength(2)]],
    lastName: [null, [Validators.required, Validators.minLength(2)]],
    start_of_work_date: [null, Validators.required],
    gender: [null, Validators.required],
    roles: this.fb.array([])
  });
}
get roles(){
  return this.editWorkerForm.get("roles") as FormArray
  }
ngOnInit(): void {
  this.roleNameService.getRolesName().subscribe({
    next: (res) => this.rolesName = res
  });

  this.workerService.getByIdWorker(this.data['id']).subscribe({
    next: (res) => {
      this.workerForEdit = res;
      this.editWorkerForm.patchValue({
        workerId: this.workerForEdit.workerId,
        firstName: this.workerForEdit.firstName,
        lastName: this.workerForEdit.lastName,
        start_of_work_date: new Date(this.workerForEdit.start_of_work_date),
        gender: this.workerForEdit.gender
      });

      const rolesArray = res.roles.map(role => this.fb.group({
        roleNameId: [role.roleNameId, Validators.required],
        date_of_entry_into_office: [new Date(role.date_of_entry_into_office), Validators.required],
        Managerial: [role.managerial, Validators.required]
      }));
      this.editWorkerForm.setControl('roles', this.fb.array(rolesArray));

      // Apply the asynchronous validator after patching the form values
      this.editWorkerForm.get('roles').value.forEach((role: any, index: number) => {
        const control = this.editWorkerForm.get('roles')?.get(index.toString());
        control?.get('date_of_entry_into_office')?.setAsyncValidators(this.dateAfterStartValidator());
      });
    }
  });
}


dateAfterStartValidator() {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    return new Promise((resolve) => {
      const entryDate = new Date(control.value);
      const startDate = new Date(this.editWorkerForm.get('start_of_work_date')?.value);

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
console.log(this.editWorkerForm.value);
this.workerService.PutWorker(this.editWorkerForm.value).subscribe({next:(res)=>console.log("putSucsses")})
}
  removeRole(index: number) {
    const rolesArray = this.editWorkerForm.get('roles') as FormArray;
    rolesArray.removeAt(index);
  }

  addRole() {
    const role = this.fb.group({
      roleNameId: ['', Validators.required],
      date_of_entry_into_office: [new Date(), [Validators.required,]],
      Managerial: [false, Validators.required]
    });
    const rolesFormGroup = this.editWorkerForm.get('roles') as FormArray;
    rolesFormGroup.push(role);

    const lastIndex = rolesFormGroup.length - 1;
    rolesFormGroup.at(lastIndex).get('date_of_entry_into_office')?.setAsyncValidators(this.dateAfterStartValidator());
  }}
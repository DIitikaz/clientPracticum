import { Component, OnInit } from '@angular/core';
import { WorkerForEdit } from '../workerforEdit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerService } from '../workers.service';
import {  Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
@Component({
  selector: 'app-edit-worker',
  standalone: true,
  imports: [ CommonModule,MatCheckboxModule,MatSelectModule,MatDialogModule,MatButtonModule,MatInputModule,FormsModule,ReactiveFormsModule,MatDatepickerModule,
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
  formGroup!: FormGroup;
  workerForEdit!: WorkerForEdit;
 rolesName!:RoleName[]
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private workerService: WorkerService,
    private roleNameService:RolesNameService,
    public dialogRef: MatDialogRef<EditWorkerComponent>,
    private fb: FormBuilder
  ) {
    console.log("constractor")
    this.formGroup = this.fb.group({
      workerId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      start_of_work_date: ['', Validators.required],
      gender: [false, Validators.required],
      roles: this.fb.array([])
      
    });
    console.log( this.formGroup.value)
  }
get roles():FormArray{
  return this.formGroup.get("roles") as FormArray
}
  
  ngOnInit(): void {
    console.log("oninit")
    console.log(this.data);
    this.roleNameService.getRolesName().subscribe({next:(res)=>this.rolesName=res})
    this.workerService.getByIdWorker(this.data['id']).subscribe({
      next: (res) => {
        this.workerForEdit = res;
        console.log(this.workerForEdit);

        const formattedDate1 = formatDate(this.workerForEdit.start_of_work_date, 'yyyy-MM-dd', 'en-US');

        this.formGroup.patchValue({
          workerId: this.workerForEdit.workerId,
          firstName: this.workerForEdit.firstName,
          lastName: this.workerForEdit.lastName,
          start_of_work_date: formattedDate1,
          gender: this.workerForEdit.gender, 
          // roles: this.fb.array([])
        });

        // Populate roles FormArray
        const rolesArray = res.roles.map(role => this.fb.group({
          roleNameId: [role.roleNameId, Validators.required],
          date_of_entry_into_office: [new Date(role.date_of_entry_into_office), Validators.required],
          Managerial: [false,Validators.required]
        }));
        this.formGroup.setControl('roles', this.fb.array(rolesArray));
      }
    });
  }
onSubmit(){
console.log(this.formGroup.value);
this.workerService.PutWorker(this.formGroup.value).subscribe({next:(res)=>console.log("putSucsses")})
}
  removeRole(index: number) {
    const rolesArray = this.formGroup.get('roles') as FormArray;
    rolesArray.removeAt(index);
  }

  addRole() {
    const role = this.fb.group({
      roleNameId: ['', Validators.required],
      date_of_entry_into_office: ['', Validators.required],
      Managerial: [false, Validators.required]
    });
    (this.formGroup.get('roles') as FormArray).push(role);
  }
}
  
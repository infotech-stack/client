import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import { DataSharingService } from '../../../shared/services/data-sharing/data-sharing.service';
import { MatSelectChange } from '@angular/material/select';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  taskForm: FormGroup;
  // employees = [
  //   { id: 1, name: 'John Doe' },
  //   { id: 2, name: 'Jane Smith' },
  //   { id: 3, name: 'Michael Johnson' },
  //   { id: 4, name: 'Emily Brown' },
  //   { id: 5, name: 'David Wilson' }
  // ];
  employees: any;
  filesToUpload: File[] = [];
  selectedEmployeeIds: any[] = [];
  empId!: number;
  taskId!:number;
  roles:any
  taskDetails:any;
  addFlag:boolean=true;
  editFlag:boolean=false;
  taskStatus:string[]=[
    'Pending','done','on progress'
  ]
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private fb: FormBuilder, private _apiService: ApiService,private _dataSharing:DataSharingService) {
    this.taskForm = this.fb.group({
      projectName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      projectStatus: ['', Validators.required],
      assignTo: ['', Validators.required],
    });
  }

  //* -------------------------  Lifecycle Hooks  --------------------------*//  
  ngOnInit(): void {
    // this._dataSharing.getEmployeeDatils.subscribe({
    //   next: (data) => {
    //     this.empId=data.empId;
    //     this.roles = data.employee_role;
    //     this.getTaskByRole();
    //   },
    //   error: (err) => {}
    // });
    const encryptedEmployeeFromStorage = sessionStorage.getItem('encryptedEmployee');
    const decryptedEmployee = this.decryptData(encryptedEmployeeFromStorage);
      this.empId=decryptedEmployee.empId;
      this.roles=decryptedEmployee.employee_role;
      this.getTaskByRole();
    this.getEmoployee();
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  // onFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files) {
  //     for (let i = 0; i < input.files.length; i++) {
  //       this.filesToUpload.push(input.files[i]);
  //     }
  //     this.taskForm.patchValue({
  //       fileAttachments: this.filesToUpload
  //     });
  //   }
  // }
  getEmoployee() {
    this._apiService.getEmployee(this.empId,this.roles).subscribe({


      next: (res) => {
        this.employees = res.data;
        console.log(this.employees);

      },
      error: (err) => {
        throw err;
      }
    })
  }
  // if (this.taskForm.valid) {
  //   const formData = new FormData();
  //   formData.append('projectName', this.taskForm.get('projectName')?.value);
  //   formData.append('startDate', this.taskForm.get('startDate')?.value);
  //   formData.append('endDate', this.taskForm.get('endDate')?.value);
  //   formData.append('projectStatus', this.taskForm.get('projectStatus')?.value);
  //   formData.append('taskName', this.taskForm.get('taskName')?.value);
  //   formData.append('assignTo', this.taskForm.get('assignTo')?.value);
  //   console.log(formData);

  //   // Append multiple files
  //   for (let file of this.filesToUpload) {
  //     formData.append('fileAttachments', file, file.name);
  //   }

  //   this._apiService.assignTask(formData).subscribe(response => {
  //     console.log('Task assigned successfully', response);
  //   }, error => {
  //     console.error('Error assigning task', error);
  //   });
  // }
  getEmployeeId(event: any): void {
    const selectedValues = event.value; 
    console.log('Selected Values:', selectedValues);
    let selectedEmployeeIds: string[] = [];
    if (selectedValues.includes('all')) {
      selectedEmployeeIds = this.employees.map((emp: { empId: { toString: () => any; }; }) => emp.empId.toString());
    } else {
      selectedEmployeeIds = selectedValues
        .map((name: string) => {
          const employee = this.employees.find((emp: { employee_name: string; }) => emp.employee_name === name);
          return employee ? employee.empId.toString() : null;
        })
        .filter((empId: null) => empId !== null) as string[];
    }
    console.log('Selected Employee IDs:', selectedEmployeeIds);
    this.taskForm.patchValue({ assignTo: selectedEmployeeIds });
    this.selectedEmployeeIds = selectedEmployeeIds;
  }
  
  taskAssign(): void {
    if (this.taskForm.valid) {
      const formData = {
        project_name: this.taskForm.controls['projectName'].value,
        start_date: this.taskForm.controls['startDate'].value,
        end_date: this.taskForm.controls['endDate'].value,
        project_status: this.taskForm.controls['projectStatus'].value,
        assignTo: this.selectedEmployeeIds
      };

      console.log(formData);

      this._apiService.taskAssignToEmployee(formData).subscribe({
        next: (res) => {
          console.log(res);
          this.getTaskByRole();
          this.taskForm.reset();
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
  getTaskByRole() {
    this._apiService.getTaskByRole(this.empId,this.roles).subscribe({
      next: (res) => {
        this.taskDetails=res.data;
        console.log(this.taskDetails,'task');
        this.addFlag=true;
        this.editFlag=false;

      },
      error: (err) => {
        console.error(err);
      }
    })
  }
  updateTask(){
    let taskObj={
      project_name:this.taskForm.controls['projectName'].value,
      start_date:this.taskForm.controls['startDate'].value,
      end_date:this.taskForm.controls['endDate'].value,
      project_status:this.taskForm.controls['projectStatus'].value,
      assignTo:this.selectedEmployeeIds
    }
    console.log(taskObj);
    
    this._apiService.updatetask(this.taskId,this.empId,taskObj).subscribe({
      next: (res) => {
        console.log(res);
        
      },
      error:()=>{}
    });
  }
  editTask(item: any, employee: any) {
    this.addFlag=false;
    this.editFlag=true;
    this.empId = employee.empId;
    this.taskId = item.task_id;
    const assignToNames = [employee.employee_name];
    const start = new Date(item.start_date).toISOString().split('T')[0];
    const end = new Date(item.end_date).toISOString().split('T')[0];
    this.taskForm.patchValue({
      projectName: item.project_name,
      startDate: start,
      endDate: end,
      projectStatus: item.project_status,
      assignTo: assignToNames 
    });
    console.log(this.taskForm);
    
  } 
  deleteTask(item:any,employee:any){

    this._apiService.deleteTask(item.task_id,employee.empId).subscribe({
      next: (res) => {
        console.log(res);
        this.getTaskByRole();
      },
      error:(err)=>{throw err}
    });
  }
  // updateTask(item:any){
  //   this._apiService.updatetask().subscribe({
  //     next: (res) => {},
  //     error: (err) => {}
  //   })
  // }
  //* --------------------------  Public methods  --------------------------*//
  get formControls() { return this.taskForm.controls; }
  getBadgeClass(status: string): string {
    switch (status) {
      case 'done':
        return 'badge bg-success';
      case 'on progress':
        return 'badge bg-warning';
      case 'pending':
        return 'badge bg-danger';
      default:
        return '';
    }
  }
  
  //* ------------------------------ Helper Function -----------------------*//
  decryptData = (encryptedData: any) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};
  //! -------------------------------  End  --------------------------------!//
}

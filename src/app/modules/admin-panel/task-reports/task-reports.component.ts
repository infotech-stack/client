import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { DataSharingService } from '../../../shared/services/data-sharing/data-sharing.service';
import * as CryptoJS from 'crypto-js';
interface Task {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

@Component({
  selector: 'app-task-reports',
  templateUrl: './task-reports.component.html',
  styleUrl: './task-reports.component.scss'
})
export class TaskReportsComponent {
 //* --------------------------  Start  -----------------------------------*//
  
    //* -----------------------  Decorated Methods  --------------------------*//
    tasks:any;
    roles:any;
    empId!:number;
    // //* -----------------------  Variable Declaration  -----------------------*//
    //* ---------------------------  Constructor  ----------------------------*//
    constructor(private _apiService:ApiService,private _dataSharing:DataSharingService) {

    }
    //* -------------------------  Lifecycle Hooks  --------------------------*//
    ngOnInit(): void {
      // this._dataSharing.getEmployeeDatils.subscribe({
      //   next:(data:any)=>{
      //     this.empId=data.empId;
      //     this.roles=data.employee_role;
      //     this.getTaskDetails();
      //   },
      //   error:(err:any)=>{throw err},
      // })
      const encryptedEmployeeFromStorage = sessionStorage.getItem('encryptedEmployee');
      const decryptedEmployee = this.decryptData(encryptedEmployeeFromStorage);
        this.empId=decryptedEmployee.empId;
        this.roles=decryptedEmployee.employee_role;
        this.getTaskDetails();
    }
    //* ----------------------------  APIs Methods  --------------------------*//
    getTaskDetails(){
      this._apiService.getTaskByRole(this.empId,this.roles).subscribe({
        next:(res:any)=>{
          this.tasks=res.data;
          console.log(this.tasks);
          
        },
        error:(err:any)=>{}
      })
    }
    updateTaskStatus(task:any){
      // let reportObj={
      //   project_status:
      // }
      console.log(task.selectedStatus);
      
      this._apiService.taskReports(this.empId,task.task_id,task.selectedStatus).subscribe({
        next:(res:any)=>{
          console.log(res);
          
        },
        error:(err:any)=>{
          throw err;
        }
      });
    }
    getStatusText(status: string): string {
      switch (status) {
        case 'done':
          return 'Done';
        case 'on progress':
          return 'On Progress';
        case 'not started':
          return 'Not Started';
        default:
          return 'Unknown';
      }
    }
    editTask(task: Task): void {
      console.log('Edit task', task);
    }
    // deleteTask(taskId: number): void {
    //   this.tasks = this.tasks.filter(task => task.id !== taskId);
    //   console.log('Delete task', taskId);
    // }
    //* --------------------------  Public methods  --------------------------*//
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

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
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrl: './task-status.component.scss'
})
export class TaskStatusComponent implements OnInit {
 
  //* --------------------------  Start  -----------------------------------*//
  
    //* -----------------------  Decorated Methods  --------------------------*//
    // tasks: Task[] = [
    //   { id: 1, name: 'Task 1', startDate: new Date('2023-07-01'), endDate: new Date('2023-07-10'), status: 'done' },
    //   { id: 2, name: 'Task 2', startDate: new Date('2023-07-05'), endDate: new Date('2023-07-15'), status: 'on progress' },
    //   { id: 3, name: 'Task 3', startDate: new Date('2023-07-07'), endDate: new Date('2023-07-20'), status: 'not started' }
    // ];
    tasks:any;
    roles:any;
    empId!:number;
    totalPages: number = 1;
    currentPage: number = 1;
    pageSize: any = 5;
    sortField: string = 'employee_name';
    sortOrder: string = 'ASC';
    search: string = '';
    // taskDetails: any[] = [];
    pageSizeOptions: (number | string)[] = [5, 10, 20, 'all'];
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
      const limit = this.pageSize === 'all' ? -1 : Number(this.pageSize);
      this._apiService.getTaskByRole(this.empId,this.roles,this.currentPage, this.pageSize).subscribe({
        next:(res:any)=>{
          this.tasks=res.data;
          console.log(this.tasks);
          this.totalPages = limit === -1 ? 1 : Math.ceil(res.total / Number(this.pageSize));
        },
        error:(err:any)=>{}
      })
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
  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.currentPage = 1; // Reset to the first page on page size change
    this.getTaskDetails();
  }
  
  onPageChange(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.getTaskDetails();
    }
  }
  
  onSearchChange(event: any) {
    this.search = event.target.value;
    this.currentPage = 1; // Reset to the first page on search change
    this.getTaskDetails();
  }
  
  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC'; // Toggle sort order
    this.getTaskDetails();
  }
  onSearch(): void {
    this.currentPage = 1; // Reset to first page on new search
    this.getTaskDetails();
  }
    //! -------------------------------  End  --------------------------------!//
}

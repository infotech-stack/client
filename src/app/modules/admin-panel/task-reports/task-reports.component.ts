import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { DataSharingService } from '../../../shared/services/data-sharing/data-sharing.service';
import * as CryptoJS from 'crypto-js';
import { SnackBarService } from '../../../shared/services/snackbar/snackbar.service';
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
  tasks: any;
  roles: any;
  empId!: number;
  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: any = 5;
  sortField: string = 'employee_name';
  sortOrder: string = 'ASC';
  search: string = '';
  pageSizeOptions: (number | string)[] = [5, 10, 20, 'all'];
  alertSuccess: boolean = false;
  alertError: boolean = false;
  alertMessage: string = '';
  is_loading:boolean=false;
  // //* -----------------------  Variable Declaration  -----------------------*//

  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private _apiService: ApiService, private _dataSharing: DataSharingService, private _snakbar: SnackBarService) {


  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    const encryptedEmployeeFromStorage = sessionStorage.getItem('encryptedEmployee');
    const decryptedEmployee = this.decryptData(encryptedEmployeeFromStorage);
    this.empId = decryptedEmployee.empId;
    this.roles = decryptedEmployee.employee_role;
    this.getTaskDetails();
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  getTaskDetails() {
    const limit = this.pageSize === 'all' ? -1 : Number(this.pageSize);
    this.is_loading=true;
    this._apiService.getTaskByRole(this.empId, this.roles, this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.tasks = res.data;
        this.is_loading=false;
        this._snakbar.success('Data Fetch successfully');
  
        this.totalPages = limit === -1 ? 1 : Math.ceil(res.total / Number(this.pageSize));
        this.alertMessage = res.message;
        this.alertSuccess = true;
        setTimeout(() => {
          this.alertSuccess = false;
        }, 5000)
      },
      error: (err: any) => {
        this.is_loading=false;
        this._snakbar.error('Something Went Wrong');
        this.alertMessage = err;
        this.alertError = true;
        setTimeout(() => {
          this.alertError = false;
        }, 5000)
        throw err;
      }
    })
  }
  updateTaskStatus(task: any) {
    let object = {
      project_status: task.project_status
    }
    this.is_loading=true;
    this._apiService.taskReports(this.empId, task.task_id, object).subscribe({
      next: (res: any) => {
        this.is_loading=false;
        this.getTaskDetails();
      },
      error: (err: any) => {
        this.is_loading=false;
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

  }
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
    this.currentPage = 1; 
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
    this.currentPage = 1; 
    this.getTaskDetails();
  }
  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC'; 
    this.getTaskDetails();
  }
  onSearch(): void {
    this.currentPage = 1; 
    this.getTaskDetails();
  }
  downloadFile(filename: any) {
    filename.forEach((file: string) => {
      this.download(file)
    })
  }
  download(fileName: string) {
    this._apiService.getFile(fileName).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      const blob = new Blob([response.body], { type: response.body.type });

      const objectUrl = window.URL.createObjectURL(blob);
      const fileLink: any = {
        sender_id: this.empId,
        message: `File: ${this.getFileNameFromContentDisposition(contentDisposition) || fileName}`,
        fileUrl: objectUrl,
        fileName: this.getFileNameFromContentDisposition(contentDisposition) || fileName,
        timestamp: new Date()
      };
      const a = document.createElement('a');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.href = objectUrl;
      a.download = fileLink.fileName
      a.click();
      window.URL.revokeObjectURL(objectUrl);
    })
  }
  private getFileNameFromContentDisposition(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;
    const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
    return fileNameMatch ? fileNameMatch[1] : null;
  }
  //! -------------------------------  End  --------------------------------!//
}

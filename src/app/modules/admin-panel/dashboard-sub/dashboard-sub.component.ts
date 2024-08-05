import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { Chart } from 'chart.js/auto'; 
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackBarService } from '../../../shared/services/snackbar/snackbar.service';
import { TaskDetailsDialogComponent } from '../../../shared/dialog/task-details-dialog/task-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-sub',
  templateUrl: './dashboard-sub.component.html',
  styleUrls: ['./dashboard-sub.component.scss']
})
export class DashboardSubComponent implements OnInit, AfterViewInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('taskStatusChart') taskStatusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;

  //* -----------------------  Variable Declaration  -----------------------*//
  empId!: number;
  searchForm: FormGroup;
  roles: any;
  taskDetails: any;
  taskCounts = {
    all: 0,
    done: 0,
    onProgress: 0,
    pending: 0
  };
  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: any = 5;
  sortField: string = 'employee_name';
  sortOrder: string = 'ASC';
  search: string = '';
  pageSizeOptions: (number | string)[] = [5, 10, 20, 'all'];
  taskStatusChart!: any | null;
  pieChart!: any | null;
  is_loading:boolean=false;
  tasks: any[] = [];
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private _apiService: ApiService, private fb: FormBuilder, private _snakbar: SnackBarService,public _dialog:MatDialog) {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//

  ngOnInit(): void {
    const encryptedEmployeeFromStorage = sessionStorage.getItem('encryptedEmployee');
    const decryptedEmployee = this.decryptData(encryptedEmployeeFromStorage);
    this.empId = decryptedEmployee.empId;
    this.roles = decryptedEmployee.employee_role;
    this.getTaskDetails();
  }
  ngAfterViewInit(): void {
    this.getTaskDetails();
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  getTaskDetails(): void {
    const limit = this.pageSize === 'all' ? -1 : Number(this.pageSize);
    this.is_loading=true;
    this._apiService.getTaskByRole(this.empId, this.roles, this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.is_loading=false;
        this._snakbar.success('Data Fetch successfully');
        this.taskDetails = res.data;
  
        this.totalPages = limit === -1 ? 1 : Math.ceil(res.total / Number(this.pageSize));
        this.calculateTaskCounts(this.taskDetails);
        this.renderBarChart();
        this.renderPieChart();
      },
      error: (err) => {
        this.is_loading=false;
        this._snakbar.error('Something Went Wrong');
        throw err;
      }
    });
  }
  //* --------------------------  Public methods  --------------------------*//
  openTaskDetails(status: string): void {
   
    
    let allTasks = this.taskDetails.flatMap((employee: { taskDetails: any; }) => employee.taskDetails);
    let filteredTasks = status === 'all' ? allTasks : allTasks.filter((task: { project_status: string; }) => task.project_status === status);
    this._dialog.open(TaskDetailsDialogComponent, {
      width: '500px',
      data: { tasks: filteredTasks }
    });
  }
  
  //* ------------------------------ Helper Function -----------------------*//
  calculateTaskCounts(tasks: any): void {
    let allTasks: any[] = [];
    tasks.forEach((employee: { taskDetails: any }) => {
      allTasks = [...allTasks, ...employee.taskDetails];
    });
    this.taskCounts.all = allTasks.length;
    this.taskCounts.done = allTasks.filter(task => task.project_status === 'done').length;
    this.taskCounts.onProgress = allTasks.filter(task => task.project_status === 'on progress').length;
    this.taskCounts.pending = allTasks.filter(task => task.project_status === 'pending').length;
  }
  renderBarChart(): void {
    if (this.taskStatusChart) {
      this.taskStatusChart.destroy();
    }
    const ctx: any = this.taskStatusChartRef?.nativeElement.getContext('2d');

    this.taskStatusChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['In Progress', 'Done', 'Pending', 'All'],
        datasets: [{
          label: 'Task Status',
          data: [this.taskCounts.onProgress, this.taskCounts.done, this.taskCounts.pending, this.taskCounts.all],
          backgroundColor: ['#007bff', '#28a745', '#ffc107', '#6f42c1']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  renderPieChart(): void {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    const ctx: any = this.pieChartRef?.nativeElement.getContext('2d');
    this.pieChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['In Progress', 'Done', 'Pending', 'All'],
        datasets: [{
          label: 'Task Status',
          data: [this.taskCounts.onProgress, this.taskCounts.done, this.taskCounts.pending, this.taskCounts.all],
          backgroundColor: ['#007bff', '#28a745', '#ffc107', '#6f42c1']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  decryptData = (encryptedData: any) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };
  onSearch(): void {
    this.currentPage = 1;
    this.getTaskDetails();
  }
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
  //! -------------------------------  End  --------------------------------!//







}

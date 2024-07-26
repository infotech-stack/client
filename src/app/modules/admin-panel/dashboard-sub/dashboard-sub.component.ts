import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { DataSharingService } from '../../../shared/services/data-sharing/data-sharing.service';
import { Chart } from 'chart.js/auto'; // Import Chart.js
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard-sub',
  templateUrl: './dashboard-sub.component.html',
  styleUrls: ['./dashboard-sub.component.scss']
})
export class DashboardSubComponent implements OnInit, AfterViewInit {
//* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('taskStatusChart') taskStatusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChart!: ElementRef<HTMLCanvasElement>;

  //* -----------------------  Variable Declaration  -----------------------*//
  empId!: number;
  searchForm:FormGroup;
  roles: any;
  taskDetails: any;
  taskCounts = {
    all: 0,
    done: 0,
    inProgress: 0,
    pending: 0
  };
  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: any = 5;
  sortField: string = 'employee_name';
  sortOrder: string = 'ASC';
  search: string = '';
  // taskDetails: any[] = [];
  pageSizeOptions: (number | string)[] = [5, 10, 20, 'all'];

  taskStatusChart: Chart | null = null;
  pieChartInstance: Chart | null = null;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private _apiService: ApiService, private _dataSharing: DataSharingService,private fb:FormBuilder) {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//

  ngOnInit(): void {
    // this._dataSharing.getEmployeeDatils.subscribe({
    //   next: (res: any) => {
    //     console.log(res);
    //     this.empId = res.empId;
    //     this.roles = res.employee_role;
    //     this.getTaskDetails();
    //   },
    //   error: (err) => {
    //     throw err;
    //   }
    // });
    const encryptedEmployeeFromStorage = sessionStorage.getItem('encryptedEmployee');
    const decryptedEmployee = this.decryptData(encryptedEmployeeFromStorage);
      this.empId=decryptedEmployee.empId;
      this.roles=decryptedEmployee.employee_role;
      this.getTaskDetails();

  }
  ngAfterViewInit(): void {
    // Render chart after view initialization
    this.getTaskDetails(); 
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  getTaskDetails(): void {
    const limit = this.pageSize === 'all' ? -1 : Number(this.pageSize);
    this._apiService.getTaskByRole(this.empId, this.roles,this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.taskDetails = res.data;
        console.log(this.taskDetails);
        this.totalPages = limit === -1 ? 1 : Math.ceil(res.total / Number(this.pageSize));
        this.calculateTaskCounts(this.taskDetails);
        this.renderBarChart(); 
        this.renderPieChart();
      },
      error: (err) => {
        throw err;
      }
    });
  }
  //* --------------------------  Public methods  --------------------------*//
  
  //* ------------------------------ Helper Function -----------------------*//
  calculateTaskCounts(tasks: any): void {
    let allTasks: any[] = [];
    tasks.forEach((employee: { taskDetails: any }) => {
      allTasks = [...allTasks, ...employee.taskDetails];
    });

    this.taskCounts.all = allTasks.length;
    this.taskCounts.done = allTasks.filter(task => task.project_status === 'done').length;
    this.taskCounts.inProgress = allTasks.filter(task => task.project_status === 'in progress').length;
    this.taskCounts.pending = allTasks.filter(task => task.project_status === 'pending').length;
  }

  renderBarChart(): void {
    const ctx:any = this.taskStatusChartRef.nativeElement.getContext('2d');
    if (this.taskStatusChart) {
      this.taskStatusChart.destroy();
    }
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['In Progress', 'Done', 'Pending', 'All'],
        datasets: [{
          label: 'Task Status',
          data: [this.taskCounts.inProgress, this.taskCounts.done, this.taskCounts.pending, this.taskCounts.all],
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
    const ctx:any = this.pieChart.nativeElement.getContext('2d');
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
    }

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['In Progress', 'Done', 'Pending', 'All'],
        datasets: [{
          label: 'Task Status',
          data: [this.taskCounts.inProgress, this.taskCounts.done, this.taskCounts.pending, this.taskCounts.all],
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
    this.currentPage = 1; // Reset to first page on new search
    this.getTaskDetails();
  }
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
  //! -------------------------------  End  --------------------------------!//






 
}

import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { DataSharingService } from '../../../shared/services/data-sharing/data-sharing.service';
import { Chart } from 'chart.js/auto'; // Import Chart.js
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-dashboard-sub',
  templateUrl: './dashboard-sub.component.html',
  styleUrls: ['./dashboard-sub.component.scss']
})
export class DashboardSubComponent implements OnInit, AfterViewInit {
  @ViewChild('taskStatusChart') taskStatusChartRef!: ElementRef<HTMLCanvasElement>;
  empId!: number;
  roles: any;
  taskDetails: any;
  taskCounts = {
    all: 0,
    done: 0,
    inProgress: 0,
    pending: 0
  };

  constructor(private _apiService: ApiService, private _dataSharing: DataSharingService) {}

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
    this.getTaskDetails(); // Ensure task details are fetched before rendering chart
  }

  getTaskDetails(): void {
    this._apiService.getTaskByRole(this.empId, this.roles).subscribe({
      next: (res: any) => {
        this.taskDetails = res.data;
        console.log(this.taskDetails);
        this.calculateTaskCounts(this.taskDetails);
        this.renderBarChart(); // Render chart after fetching task details
      },
      error: (err) => {
        throw err;
      }
    });
  }

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
  decryptData = (encryptedData: any) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };
}

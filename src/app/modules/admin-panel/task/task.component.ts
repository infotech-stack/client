import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import * as CryptoJS from 'crypto-js';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snackbar/snackbar.service';
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
  searchForm: FormGroup;
  employees: any;
  filesToUpload: File[] = [];
  selectedEmployeeIds: any[] = [];
  empId!: number;
  taskId!: number;
  roles: any
  taskDetails: any;
  addFlag: boolean = true;
  editFlag: boolean = false;
  taskStatus: string[] = [
    'pending', 'done', 'on progress'
  ]
  selectedFiles!: File[];
  selectedEmpid!: number;
  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: any = 5;
  sortField: string = 'employee_name';
  sortOrder: string = 'ASC';
  search: string = '';
  alertSuccess: boolean = false;
  alertError: boolean = false;
  alertMessage: string = '';
  pageSizeOptions: (number | string)[] = [5, 10, 20, 'all'];
  is_loading: boolean = false;
  message_id!:number;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private fb: FormBuilder, private _apiService: ApiService, private cdr: ChangeDetectorRef, public _dialog: MatDialog, private _snakbar: SnackBarService) {
    this.taskForm = this.fb.group({
      projectName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      projectStatus: ['', Validators.required],
      assignTo: ['', Validators.required],
      fileAttachment: [null],
      messageDescription: ['', Validators.required],
    });
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
    this.getTaskByRole();
    this.getEmoployee();
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  getEmoployee() {
    this._apiService.getAllEmployee().subscribe({
      next: (res) => {
        this.employees = res.data;
        this.alertMessage = res.message;
        this.alertSuccess = true;
        setTimeout(() => {
          this.alertSuccess = false;
        }, 5000)
      },
      error: (err) => {
        this.alertError = true;
        setTimeout(() => {
          this.alertError = false;
        }, 5000)
        throw err;
      }
    })
  }
  getEmployeeId(value: string[]): void {
    let selectedEmployeeIds: string[] = [];
    if (value.includes('all')) {
      selectedEmployeeIds = this.employees.map((emp: { empId: { toString: () => any; }; }) => emp.empId.toString());
    } else {
      selectedEmployeeIds = value
        .map(name => {
          const employee = this.employees.find((emp: { employee_name: string; }) => emp.employee_name === name);
          return employee ? employee.empId.toString() : null;
        })
        .filter(empId => empId !== null) as string[];
    }

    this.taskForm.patchValue({ assignTo: selectedEmployeeIds });
    this.selectedEmployeeIds = selectedEmployeeIds;
  }
  onSubmit() {
    if (this.taskForm.valid) {
      const selectedEmployeeNames = this.taskForm.controls['assignTo'].value;
      this.getEmployeeId(selectedEmployeeNames);
      const { projectName, startDate, endDate, projectStatus, assignTo, messageDescription } = this.taskForm.value;

      const files = this.selectedFiles;
      this.is_loading = true;
      this._apiService.sendMessage(projectName, startDate, endDate, projectStatus, assignTo, messageDescription, files).subscribe(
        response => {
 
         
          this.is_loading = false;
          const messageObj = {
            start_date: this.taskForm.controls['startDate'].value,
            end_date: this.taskForm.controls['endDate'].value,
            project_status: this.taskForm.controls['projectStatus'].value,
            message_description: this.taskForm.controls['messageDescription'].value,
            project_name: this.taskForm.controls['projectName'].value,
            filename: response.data,
            empId: this.selectedEmployeeIds,
            send_by: this.empId
          }
          this.postMessage(messageObj);

        },
        error => {
          this.is_loading = false;
          console.error('Error sending message', error);
        }
      );
    }
  }
  postMessage(messageObj: any) {

    
    this._apiService.postMessage(messageObj).subscribe({
      next: (res) => {

        this.getTaskByRole();
      },
      error: (err) => {
        throw err;
      }
    })
  }
  taskAssign(): void {
    if (this.taskForm.valid) {
      const selectedEmployeeNames = this.taskForm.controls['assignTo'].value;
      this.getEmployeeId(selectedEmployeeNames);
      const formData = {
        project_name: this.taskForm.controls['projectName'].value,
        start_date: this.taskForm.controls['startDate'].value,
        end_date: this.taskForm.controls['endDate'].value,
        project_status: this.taskForm.controls['projectStatus'].value,
        assignTo: this.selectedEmployeeIds,


      };



      this._apiService.taskAssignToEmployee(formData).subscribe({
        next: (res) => {
 

        },
        error: (err) => {
          throw err;
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
  getTaskByRole() {
    const limit = this.pageSize === 'all' ? -1 : Number(this.pageSize);
    this.is_loading = true;
    this._apiService.getTaskByRole(this.empId, this.roles, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.is_loading = false;
        this.addFlag = true;
        this.editFlag = false;
        this.taskDetails = res.data;
        this.totalPages = limit === -1 ? 1 : Math.ceil(res.total / Number(this.pageSize));
        this._snakbar.success('Data Fetch successfully');
      },
      error: (err) => {
        this.is_loading = false;
        this._snakbar.error('Something Went Wrong');
        throw err;
      }
    });
  }
  updateTask() {
    const selectedEmployeeNames = this.taskForm.controls['assignTo'].value;
    this.getEmployeeId(selectedEmployeeNames);
    const files = this.selectedFiles;
    const { projectName, startDate, endDate, projectStatus, assignTo, messageDescription } = this.taskForm.value;
    this.is_loading = true;
    this._apiService.sendMessage(projectName, startDate, endDate, projectStatus, assignTo, messageDescription, files).subscribe({
      next: (res) => {

        this.is_loading = false;
     
        const messageObj = {
          start_date: this.taskForm.controls['startDate'].value,
          end_date: this.taskForm.controls['endDate'].value,
          project_status: this.taskForm.controls['projectStatus'].value,
          message_description: this.taskForm.controls['messageDescription'].value,
          project_name: this.taskForm.controls['projectName'].value,
          filename: res.data,
          empId: this.taskForm.controls['assignTo'].value,
          send_by: this.empId
        }
        this.updateTask1(messageObj)
      },
      error: (error) => {
        this.is_loading = false;
        throw error;
      }
    });
  }
  updateTask1(messageObj: any) {
    this._apiService.updatetask(this.taskId, this.selectedEmpid, this.message_id, messageObj).subscribe({
      next: (res) => {
 
        this.taskForm.reset();
        this.alertMessage = '';
        
        this.alertMessage = res.message;
        this.alertSuccess = true;
        this.getTaskByRole();
        setTimeout(() => {
          this.alertSuccess = false;
        }, 5000)
      },
      error: (error) => {
        this.alertMessage = error;
        this.alertError = true;
        setTimeout(() => {
          this.alertError = false;
        }, 5000)
        throw error;
      }
    });
  }
  editTask(item: any, employee: any) {
    this.addFlag = false;
    this.editFlag = true;

    this.selectedEmpid = employee.empId;
    this.message_id=item.message_id;
    this.taskId = item.task_id;
    const assignToNames = [employee.employee_name];
    const start = new Date(item.start_date).toISOString().split('T')[0];
    const end = new Date(item.end_date).toISOString().split('T')[0];


    this.taskForm.patchValue({
      projectName: item.project_name,
      startDate: start,
      endDate: end,
      projectStatus: item.project_status,
      assignTo: assignToNames,
      messageDescription: item.message_description
    });


  }
  deleteTask(item: any, employee: any) {
    this.is_loading = true;
    this._apiService.deleteTask(item.task_id, employee.empId).subscribe({
      next: (res) => {
        this.is_loading = false;
        this.getTaskByRole();
      },
      error: (err) => {
        this.is_loading = false;
        throw err;
      }
    });
  }
  //* --------------------------  Public methods  --------------------------*//
  get formControls() {
    return this.taskForm.controls;
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
  //* ------------------------------ Helper Function -----------------------*//
  decryptData = (encryptedData: any) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };
  onPageSizeChange(event: Event) {
    const selectedSize = (event.target as HTMLSelectElement).value;
    this.pageSize = selectedSize === 'all' ? 'all' : parseInt(selectedSize, 10);
    this.currentPage = 1;
    this.getTaskByRole();
  }
  onPageChange(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.getTaskByRole();
    }
  }
  onSearchChange(event: any) {
    this.search = event.target.value;
    this.currentPage = 1;
    this.getTaskByRole();
  }
  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC'; // Toggle sort order
    this.getTaskByRole();
  }
  onSearch(): void {
    this.currentPage = 1; // Reset to first page on new search
    this.getTaskByRole();
  }
  onSelectFiles(event: any) {
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
      console.log(this.selectedFiles, 'file');
    }
  }
  openDialog(item: any, employee: any) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { employee_name: employee.employee_name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTask(item, employee);

      }
    });
  }
  //! -------------------------------  End  --------------------------------!//
}

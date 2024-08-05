import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import * as CryptoJS from 'crypto-js';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../../shared/services/snackbar/snackbar.service';
// import * as html2pdf from "html2pdf.js";
@Component({
  selector: 'app-employee-attendence',
  templateUrl: './employee-attendence.component.html',
  styleUrl: './employee-attendence.component.scss'
})
export class EmployeeAttendenceComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  @ViewChild('content', { static: false }) content!: ElementRef;
  //* -----------------------  Variable Declaration  -----------------------*//
  is_loading: boolean = false;
  filteredEmpId: any;
  employeeForm: FormGroup;
  is_filter: boolean = true;
  employeeAttendance: any[] = [];
  filteredAttendance: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private fb: FormBuilder, private _apiService: ApiService, private cdRef: ChangeDetectorRef, public dialog: MatDialog, private _snakbar: SnackBarService) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit() {
    this.getEmployeeAttendance();
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  getEmployeeAttendance() {
    this.is_loading = true;
    this._apiService.getEmployeeAttendance().subscribe({
      next: (res) => {
        this.is_loading=false;
        this._snakbar.success('Data Fetch successfully');
        this.employeeAttendance = res.data;
        this.filteredAttendance = [...this.employeeAttendance];
        this.is_filter = true;
        this.cdRef.detectChanges();

      },
      error: (err) => {
        this.is_loading=false;
        this._snakbar.error('Something Went Wrong');
        this.is_filter = true;
        this.cdRef.detectChanges();
        throw err;
      }
    });
  }
  //* --------------------------  Public methods  --------------------------*//
  get formControls() {
    return this.employeeForm.controls;
  }
  //* ------------------------------ Helper Function -----------------------*//
  onSubmit() {
    this.filterEmpIdByName();
    let obj = {
      empId: this.filteredEmpId,
      login_date_from: this.employeeForm.controls['startDate'].value,
      login_date_to: this.employeeForm.controls['endDate'].value
    };
    this.is_loading = true;
    this._apiService.employeeFilter(obj.empId, obj.login_date_from, obj.login_date_to).subscribe({
      next: (res) => {
        this.is_loading = false;
        this._snakbar.success('Data Fetch successfully');
        this.is_filter = false;
        this.filteredAttendance = res.data;
        this.cdRef.detectChanges();
   
      },
      error: (error) => {
        this.is_loading = false;
        this._snakbar.error('Something Went Wrong');
        throw error;
      }
    });
  }
  filterAttendance(filterCriteria: any) {
    this.filteredAttendance = this.employeeAttendance.filter((employee: { employee_name: string; login_date_time: string; logout_date_time: string; }) => {
      const isNameMatch = !filterCriteria.name || employee.employee_name.toLowerCase().includes(filterCriteria.name.toLowerCase());
      const isStartDateMatch = !filterCriteria.startDate || this.isDateMatch(employee.login_date_time, filterCriteria.startDate);
      const isEndDateMatch = !filterCriteria.endDate || this.isDateMatch(employee.logout_date_time, filterCriteria.endDate);
      return isNameMatch && isStartDateMatch && isEndDateMatch;
    });
  }
  filterEmpIdByName() {
    const name = this.employeeForm.controls['name'].value;
    name?.trim().toLowerCase();
    const employee = this.employeeAttendance.find((emp: { employee_name: string; }) => emp.employee_name.toLowerCase() === name);
    if (employee) {
      this.filteredEmpId = employee.empId;
  

    } else {
      this.filteredEmpId = undefined;
    }
  }
  refreshData() {
    this.is_filter = true;
    this.getEmployeeAttendance();
    this.employeeForm.reset();
  }
  private isDateMatch(dateTimeString: string, dateFilter: string): boolean {
    if (!dateTimeString) {
      return false;
    }
    const dateTime = new Date(dateTimeString);
    const filterDate = new Date(dateFilter);
    return dateTime.getFullYear() === filterDate.getFullYear() &&
      dateTime.getMonth() === filterDate.getMonth() &&
      dateTime.getDate() === filterDate.getDate();
  }
  public convertToPDF(): void {
    const data: HTMLElement | null = document.getElementById('content');
    if (!data) {
      console.error('Element not found!');
      return;
    }
    const margin = 10;
    html2canvas(data).then(canvas => {
      const imgWidth = 208 - 2 * margin;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      const position = margin;
      pdf.addImage(contentDataURL, 'PNG', margin, position, imgWidth, imgHeight);
      pdf.save('new-file.pdf');
    });

  }
  decryptData = (encryptedData: any) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };
  //! -------------------------------  End  --------------------------------!//
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import { DataSharingService } from '../../../shared/services/data-sharing/data-sharing.service';
import * as CryptoJS from 'crypto-js';
import { SnackBarService } from '../../../shared/services/snackbar/snackbar.service';
@Component({
  selector: 'app-search-employee',
  templateUrl: './search-employee.component.html',
  styleUrl: './search-employee.component.scss'
})
export class SearchEmployeeComponent implements OnInit {

  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  searchForm: FormGroup;
  employees: any;
  selectedEmployees: any;
  empId!: number;
  roles: any;
  totalPages: number = 1;
  currentPage = 1;
  pageSize: any = 10;
  sortField = 'employee_name';
  sortOrder = 'ASC';
  search = '';
  is_loading: boolean = false;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private fb: FormBuilder, private _apiService: ApiService, private _dataSharing: DataSharingService, private _snakbar: SnackBarService) {
    this.searchForm = this.fb.group({
      employeeName: ['']
    });
  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    const encryptedEmployeeFromStorage = sessionStorage.getItem('encryptedEmployee');
    const decryptedEmployee = this.decryptData(encryptedEmployeeFromStorage);
    this.empId = decryptedEmployee.empId;
    this.roles = decryptedEmployee.employee_role;
    this.getEmployees();
  }

  //* ----------------------------  APIs Methods  --------------------------*//
  onSearch(): void {
    const selectedEmpId = this.searchForm.value.employeeName;
    this.is_loading = true;
    this._apiService.searchEmployeeById(selectedEmpId).subscribe({
      next: (res: any) => {
        this.is_loading = false;
        this._snakbar.success('Data Fetch successfully');
        this.selectedEmployees = res.data;

      },
      error: (err: any) => {
        this.is_loading = false;
        this._snakbar.error('Something Went Wrong');
        throw err;

      },
    })

  }
  getEmployees() {
    this._apiService.getAllEmployee().subscribe({
      next: (res) => {
        this.employees = res.data;
      },
      error: (err) => {
        throw err;
      }
    });
  }
  //* --------------------------  Public methods  --------------------------*//

  //* ------------------------------ Helper Function -----------------------*//
  decryptData = (encryptedData: any) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };
  //! -------------------------------  End  --------------------------------!//
}

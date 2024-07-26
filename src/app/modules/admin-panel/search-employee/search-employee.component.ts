import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import { DataSharingService } from '../../../shared/services/data-sharing/data-sharing.service';
import * as CryptoJS from 'crypto-js';
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
    empId!:number;
    roles:any;
    totalPages: number=1;
    currentPage = 1;
    pageSize:any = 10;
    sortField = 'employee_name';
    sortOrder = 'ASC';
    search = '';
    //* ---------------------------  Constructor  ----------------------------*//
    constructor(private fb: FormBuilder,private _apiService:ApiService,private _dataSharing:DataSharingService) {
      this.searchForm = this.fb.group({
        employeeName: ['']
      });
    }
    //* -------------------------  Lifecycle Hooks  --------------------------*//
    ngOnInit(): void {
      // this._dataSharing.getEmployeeDatils.subscribe({
      //   next:(data:any)=>{
      //     this.empId=data.empId;
      //     this.roles=data.employee_role;
      //     this.getEmployees();
      //   },
      //   error:(err:any)=>{throw err},
      // })
      const encryptedEmployeeFromStorage = sessionStorage.getItem('encryptedEmployee');
      const decryptedEmployee = this.decryptData(encryptedEmployeeFromStorage);
        this.empId=decryptedEmployee.empId;
        this.roles=decryptedEmployee.employee_role;
        this.getEmployees();
    }
  
    //* ----------------------------  APIs Methods  --------------------------*//
    onSearch(): void {
      const selectedEmpId = this.searchForm.value.employeeName;
      console.log(selectedEmpId,'id');
      this._apiService.searchEmployeeById(selectedEmpId).subscribe({
        next:(res:any)=>{
          console.log(res.data);
          this.selectedEmployees=res.data;
        },
        error:(err:any)=>{throw err},
      })
      
    }
    getEmployees(){
      this._apiService.getEmployee(this.empId,this.roles,this.currentPage, this.pageSize).subscribe({
        next: (res) => {
          console.log(res);
          this.employees = res.data;
        },
        error: (err) => {}
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
